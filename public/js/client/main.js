const urlParams = new URLSearchParams(window.location.search);
const accessCode = urlParams.get('accessCode');

if (!accessCode) {
    alert('Invalid access. No access code provided.');
    window.location.href = '/';
}

let clientData = null;
let performers = [];
let castingGroup = [];

async function validateAccess() {
    try {
        const response = await fetch(`/api/client/validate/${accessCode}`);
        const data = await response.json();

        if (response.ok) {
            clientData = data;
            document.getElementById('companyName').textContent = data.companyName;
            document.getElementById('commercialDescription').textContent = data.commercialDescription;
            loadPerformers();
            loadCastingGroup();
        } else {
            alert(data.error || 'Invalid or expired access code');
            window.location.href = '/';
        }
    } catch (error) {
        alert('Network error. Please try again.');
    }
}

async function loadPerformers(filters = {}) {
    try {
        const params = new URLSearchParams(filters);
        const response = await fetch(`/api/performers/search?${params}`);
        performers = await response.json();
        renderPerformers();
    } catch (error) {
        console.error('Error loading performers:', error);
    }
}

function renderPerformers() {
    const grid = document.getElementById('performersGrid');

    if (performers.length === 0) {
        grid.innerHTML = '<p class="col-span-full text-center text-gray-500">No performers found.</p>';
        return;
    }

    grid.innerHTML = performers.map(p => {
        const isInCasting = castingGroup.includes(p.id);
        const age = calculateAge(p.birthday);

        return `
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="relative">
                    ${p.images && p.images[0]
                        ? `<img src="${p.images[0]}" class="w-full h-64 object-cover cursor-pointer" onclick="viewImage('${p.images[0]}')">`
                        : '<div class="w-full h-64 bg-gray-300"></div>'
                    }
                    ${p.images && p.images.length > 1
                        ? `<div class="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">+${p.images.length - 1} more</div>`
                        : ''
                    }
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-lg mb-2">${p.firstName} ${p.lastName}</h3>
                    <div class="text-sm text-gray-600 space-y-1 mb-3">
                        <p>${p.gender} | ${age} years | ${p.height}cm</p>
                        <p>${p.hairColor} hair | ${p.eyeColor} eyes</p>
                        <p>${p.skinTone} skin</p>
                        ${p.distinctiveMarks ? `<p class="text-xs">Marks: ${p.distinctiveMarks}</p>` : ''}
                    </div>
                    <button
                        onclick="togglePerformer('${p.id}')"
                        class="${isInCasting ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} w-full text-white py-2 rounded-lg transition">
                        ${isInCasting ? 'Remove' : 'Add to Group'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function calculateAge(birthday) {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

function applyFilters() {
    const filters = {};

    const searchName = document.getElementById('searchName').value.trim();
    const gender = document.getElementById('filterGender').value;
    const minAge = document.getElementById('minAge').value;
    const maxAge = document.getElementById('maxAge').value;
    const hairColor = document.getElementById('hairColor').value.trim();
    const eyeColor = document.getElementById('eyeColor').value.trim();

    if (searchName) filters.search = searchName;
    if (gender) filters.gender = gender;
    if (minAge) filters.minAge = minAge;
    if (maxAge) filters.maxAge = maxAge;
    if (hairColor) filters.hairColor = hairColor;
    if (eyeColor) filters.eyeColor = eyeColor;

    loadPerformers(filters);
}

async function togglePerformer(performerId) {
    try {
        const isInCasting = castingGroup.includes(performerId);
        const endpoint = isInCasting ? '/api/client/casting-group/remove' : '/api/client/casting-group/add';

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clientId: clientData.id,
                performerId
            })
        });

        if (response.ok) {
            await loadCastingGroup();
            renderPerformers();
        }
    } catch (error) {
        alert('Network error. Please try again.');
    }
}

async function loadCastingGroup() {
    try {
        const response = await fetch(`/api/client/casting-group/${clientData.id}`);
        const data = await response.json();

        castingGroup = data.castingGroup?.performerIds || [];
        document.getElementById('castingCount').textContent = castingGroup.length;

        // Render casting group sidebar
        const list = document.getElementById('castingGroupList');
        if (castingGroup.length === 0) {
            list.innerHTML = '<p class="text-gray-500 text-sm">No performers selected yet.</p>';
        } else {
            const selectedPerformers = data.performers || [];
            list.innerHTML = selectedPerformers.map(p => `
                <div class="flex gap-3 bg-gray-50 p-3 rounded-lg">
                    ${p.images && p.images[0]
                        ? `<img src="${p.images[0]}" class="w-16 h-16 rounded object-cover">`
                        : '<div class="w-16 h-16 rounded bg-gray-300"></div>'
                    }
                    <div class="flex-1">
                        <p class="font-semibold">${p.firstName} ${p.lastName}</p>
                        <p class="text-xs text-gray-600">${p.gender} | ${calculateAge(p.birthday)}y</p>
                    </div>
                    <button onclick="togglePerformer('${p.id}')" class="text-red-500 hover:text-red-700">✕</button>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading casting group:', error);
    }
}

function toggleCastingGroup() {
    const sidebar = document.getElementById('castingSidebar');
    sidebar.classList.toggle('hidden');
}

async function finalizeCasting() {
    if (castingGroup.length === 0) {
        alert('Please select at least one performer before finalizing.');
        return;
    }

    if (!confirm(`Are you sure you want to finalize your selection of ${castingGroup.length} performer(s)?`)) {
        return;
    }

    try {
        const response = await fetch('/api/client/casting-group/finalize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clientId: clientData.id
            })
        });

        if (response.ok) {
            alert('Your casting selection has been finalized! Our team will contact you soon.');
            window.location.reload();
        } else {
            const data = await response.json();
            alert(data.error || 'Failed to finalize casting');
        }
    } catch (error) {
        alert('Network error. Please try again.');
    }
}

function viewImage(imageUrl) {
    document.getElementById('modalImage').src = imageUrl;
    document.getElementById('imageModal').classList.remove('hidden');
}

function closeImageModal() {
    document.getElementById('imageModal').classList.add('hidden');
}

// Initialize
validateAccess();
