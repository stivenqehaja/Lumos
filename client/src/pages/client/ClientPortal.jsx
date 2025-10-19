import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { performerAPI, clientAPI } from '../../services/api';
import PerformerCard from '../../components/client/PerformerCard';
import PerformerModal from '../../components/client/PerformerModal';
import './ClientPortal.css';

const ClientPortal = () => {
    const [searchParams] = useSearchParams();
    const [performers, setPerformers] = useState([]);
    const [filteredPerformers, setFilteredPerformers] = useState([]);
    const [castingGroup, setCastingGroup] = useState([]);
    const [selectedPerformer, setSelectedPerformer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [clientInfo, setClientInfo] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        gender: '',
        minAge: '',
        maxAge: '',
        hairColor: '',
        eyeColor: '',
        minHeight: '',
        maxHeight: '',
    });

    const accessCode = searchParams.get('code');

    useEffect(() => {
        if (accessCode) {
            validateAndLoadClient();
        } else {
            loadAllPerformers();
        }
    }, [accessCode]);

    useEffect(() => {
        applyFilters();
    }, [performers, filters]);

    const validateAndLoadClient = async () => {
        try {
            const response = await clientAPI.validate(accessCode);
            setClientInfo(response.data.client);
            await loadAllPerformers();
            await loadCastingGroup(response.data.client.id);
        } catch (error) {
            alert('Invalid or expired access link');
        }
    };

    const loadAllPerformers = async () => {
        try {
            const response = await performerAPI.search({});
            setPerformers(response.data.performers || []);
        } catch (error) {
            console.error('Failed to load performers');
        } finally {
            setLoading(false);
        }
    };

    const loadCastingGroup = async (clientId) => {
        try {
            const response = await clientAPI.getCastingGroup(clientId);
            setCastingGroup(response.data.performers || []);
        } catch (error) {
            console.error('Failed to load casting group');
        }
    };

    const applyFilters = () => {
        let filtered = [...performers];

        // Search by name
        if (filters.search) {
            filtered = filtered.filter(p =>
                `${p.firstName} ${p.lastName}`.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        // Gender filter
        if (filters.gender) {
            filtered = filtered.filter(p => p.gender === filters.gender);
        }

        // Hair color filter
        if (filters.hairColor) {
            filtered = filtered.filter(p =>
                p.hairColor.toLowerCase().includes(filters.hairColor.toLowerCase())
            );
        }

        // Eye color filter
        if (filters.eyeColor) {
            filtered = filtered.filter(p =>
                p.eyeColor.toLowerCase().includes(filters.eyeColor.toLowerCase())
            );
        }

        // Height filter
        if (filters.minHeight) {
            filtered = filtered.filter(p => p.height >= parseInt(filters.minHeight));
        }
        if (filters.maxHeight) {
            filtered = filtered.filter(p => p.height <= parseInt(filters.maxHeight));
        }

        // Age filter (calculate from birthday)
        if (filters.minAge || filters.maxAge) {
            filtered = filtered.filter(p => {
                const age = calculateAge(p.birthday);
                const matchesMin = !filters.minAge || age >= parseInt(filters.minAge);
                const matchesMax = !filters.maxAge || age <= parseInt(filters.maxAge);
                return matchesMin && matchesMax;
            });
        }

        setFilteredPerformers(filtered);
    };

    const calculateAge = (birthday) => {
        const today = new Date();
        const birthDate = new Date(birthday);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            gender: '',
            minAge: '',
            maxAge: '',
            hairColor: '',
            eyeColor: '',
            minHeight: '',
            maxHeight: '',
        });
    };

    const isInCastingGroup = (performerId) => {
        return castingGroup.some(p => p.id === performerId);
    };

    const handleToggleCastingGroup = async (performer) => {
        if (!clientInfo) {
            alert('Please use a valid client access link');
            return;
        }

        try {
            if (isInCastingGroup(performer.id)) {
                await clientAPI.removeFromCastingGroup({
                    clientId: clientInfo.id,
                    performerId: performer.id,
                });
                setCastingGroup(castingGroup.filter(p => p.id !== performer.id));
            } else {
                await clientAPI.addToCastingGroup({
                    clientId: clientInfo.id,
                    performerId: performer.id,
                });
                setCastingGroup([...castingGroup, performer]);
            }
        } catch (error) {
            alert('Failed to update casting group');
        }
    };

    const handleFinalize = async () => {
        if (!clientInfo) return;

        if (castingGroup.length === 0) {
            alert('Please select at least one performer');
            return;
        }

        if (!confirm(`Finalize casting with ${castingGroup.length} performer(s)?`)) {
            return;
        }

        try {
            await clientAPI.finalizeCastingGroup({ clientId: clientInfo.id });
            alert('Casting finalized successfully!');
        } catch (error) {
            alert('Failed to finalize casting');
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading">Loading performers...</div>
            </div>
        );
    }

    return (
        <div className="page-container client-portal">
            <div className="content-wrapper">
                {clientInfo && (
                    <div className="client-header">
                        <h1 className="page-title">{clientInfo.companyName}</h1>
                        <p className="commercial-desc">{clientInfo.commercialDescription}</p>
                        <div className="casting-counter">
                            <span className="counter-badge">{castingGroup.length}</span>
                            <span>Selected</span>
                            <button onClick={handleFinalize} className="button-primary">
                                Finalize Casting
                            </button>
                        </div>
                    </div>
                )}

                {!clientInfo && (
                    <h1 className="page-title">Browse Performers</h1>
                )}

                {/* Filters */}
                <div className="filters-section">
                    <div className="filters-grid">
                        <input
                            type="text"
                            name="search"
                            className="form-input"
                            placeholder="Search by name..."
                            value={filters.search}
                            onChange={handleFilterChange}
                        />

                        <select
                            name="gender"
                            className="form-select"
                            value={filters.gender}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Genders</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Non-binary">Non-binary</option>
                            <option value="Other">Other</option>
                        </select>

                        <input
                            type="number"
                            name="minAge"
                            className="form-input"
                            placeholder="Min Age"
                            value={filters.minAge}
                            onChange={handleFilterChange}
                        />

                        <input
                            type="number"
                            name="maxAge"
                            className="form-input"
                            placeholder="Max Age"
                            value={filters.maxAge}
                            onChange={handleFilterChange}
                        />

                        <input
                            type="text"
                            name="hairColor"
                            className="form-input"
                            placeholder="Hair Color"
                            value={filters.hairColor}
                            onChange={handleFilterChange}
                        />

                        <input
                            type="text"
                            name="eyeColor"
                            className="form-input"
                            placeholder="Eye Color"
                            value={filters.eyeColor}
                            onChange={handleFilterChange}
                        />

                        <input
                            type="number"
                            name="minHeight"
                            className="form-input"
                            placeholder="Min Height (cm)"
                            value={filters.minHeight}
                            onChange={handleFilterChange}
                        />

                        <input
                            type="number"
                            name="maxHeight"
                            className="form-input"
                            placeholder="Max Height (cm)"
                            value={filters.maxHeight}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <button onClick={clearFilters} className="button-secondary">
                        Clear Filters
                    </button>
                </div>

                {/* Results Count */}
                <div className="results-info">
                    <p>Showing {filteredPerformers.length} of {performers.length} performers</p>
                </div>

                {/* Performers Grid */}
                <div className="performers-grid">
                    {filteredPerformers.map((performer) => (
                        <PerformerCard
                            key={performer.id}
                            performer={performer}
                            isSelected={isInCastingGroup(performer.id)}
                            onToggleSelect={() => handleToggleCastingGroup(performer)}
                            onViewDetails={() => setSelectedPerformer(performer)}
                            showSelectButton={!!clientInfo}
                        />
                    ))}
                </div>

                {filteredPerformers.length === 0 && (
                    <div className="empty-state">
                        <p>No performers match your filters</p>
                    </div>
                )}
            </div>

            {/* Performer Detail Modal */}
            {selectedPerformer && (
                <PerformerModal
                    performer={selectedPerformer}
                    isSelected={isInCastingGroup(selectedPerformer.id)}
                    onToggleSelect={() => handleToggleCastingGroup(selectedPerformer)}
                    onClose={() => setSelectedPerformer(null)}
                    showSelectButton={!!clientInfo}
                />
            )}
        </div>
    );
};

export default ClientPortal;
