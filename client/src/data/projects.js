// Portfolio entries shown on the Work page and the Home "featured work" strip.
// Add a new object here for each new project — no other code needs to change.
// mediaType 'video' expects an .mp4 in /public/videos, 'image' an asset in /public/images.

export const CATEGORIES = [
    'Real Estate',
    'Dental',
    'Hair Transplant',
    'Restaurants',
    'Resorts',
    'TV Commercials',
    'Podcasts',
    'Cars',
    'Photoshoots',
];

// PLACEHOLDER — swap these for real graded deliverables per vertical as they come in.
export const projects = [
    {
        id: 'placeholder-plate',
        title: 'Coastal Villa Walkthrough',
        category: 'Real Estate',
        mediaType: 'video',
        src: '/videos/plate.mp4',
        description: 'Placeholder — swap for a real estate listing reel.',
        featured: true,
    },
    {
        id: 'placeholder-horse',
        title: 'Countryside Estate',
        category: 'Resorts',
        mediaType: 'video',
        src: '/videos/horse.mp4',
        description: 'Placeholder — swap for a resort/hospitality reel.',
        featured: true,
    },
    {
        id: 'placeholder-bell',
        title: 'Modern Residence',
        category: 'Real Estate',
        mediaType: 'video',
        src: '/videos/bell.mp4',
        description: 'Placeholder — swap for a real estate listing reel.',
        featured: true,
    },
];

export const getProjectsByCategory = (category) =>
    category && category !== 'All' ? projects.filter((p) => p.category === category) : projects;
