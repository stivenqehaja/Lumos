const token = localStorage.getItem('adminToken');
if (!token) {
    window.location.href = '/admin/login';
}

let performers = [];
let deletePerformerId = null;
let deleteStep = 1;

function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
}

async function loadPerformers() {
    try {
        const response = await fetch('/api/performers', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        performers = await response.json();
        renderPerformers();
    } catch (error) {
        console.error('Error loading performers:', error);
    }
}

function renderPerformers() {
    const list = document.getElementById('performersList');

    if (performers.length === 0) {
        list.innerHTML = '<p class="text-center text-gray-500">No performers found. Add your first performer!</p>';
        return;
    }

    list.innerHTML = performers.map(p => `
        <div class="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <div class="flex gap-4 items-center flex-1">
                ${p.images && p.images[0] ? `<img src="${p.images[0]}" class="w-16 h-16 rounded-full object-cover">` : '<div class="w-16 h-16 rounded-full bg-gray-300"></div>'}
                <div class="flex-1">
                    <h3 class="font-bold text-lg">${p.firstName} ${p.lastName}</h3>
                    <p class="text-sm text-gray-600">${p.gender} | ${p.height}cm | ${p.hairColor} hair | ${p.eyeColor} eyes</p>
                    <p class="text-sm text-gray-500">${p.email} | ${p.phone}</p>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="editPerformer('${p.id}')" class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
                <button onclick="showDeleteModal('${p.id}')" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
            </div>
        </div>
    `).join('');
}

function showAddForm() {
    document.getElementById('modalTitle').textContent = 'Add Performer';
    document.getElementById('performerForm').reset();
    document.getElementById('performerId').value = '';
    document.getElementById('performerModal').classList.remove('hidden');
}

function editPerformer(id) {
    const performer = performers.find(p => p.id === id);
    if (!performer) return;

    document.getElementById('modalTitle').textContent = 'Edit Performer';
    document.getElementById('performerId').value = performer.id;
    document.getElementById('firstName').value = performer.firstName;
    document.getElementById('lastName').value = performer.lastName;
    document.getElementById('birthday').value = performer.birthday;
    document.getElementById('email').value = performer.email;
    document.getElementById('phone').value = performer.phone;
    document.getElementById('gender').value = performer.gender;
    document.getElementById('height').value = performer.height;
    document.getElementById('hairColor').value = performer.hairColor;
    document.getElementById('eyeColor').value = performer.eyeColor;
    document.getElementById('skinTone').value = performer.skinTone;
    document.getElementById('faceShape').value = performer.faceShape || '';
    document.getElementById('distinctiveMarks').value = performer.distinctiveMarks || '';
    document.getElementById('images').value = (performer.images || []).join('\n');

    document.getElementById('performerModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('performerModal').classList.add('hidden');
}

document.getElementById('performerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const performerId = document.getElementById('performerId').value;
    const imagesText = document.getElementById('images').value;
    const images = imagesText.split('\n').filter(url => url.trim()).slice(0, 9);

    const performerData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        birthday: document.getElementById('birthday').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        gender: document.getElementById('gender').value,
        height: parseInt(document.getElementById('height').value),
        hairColor: document.getElementById('hairColor').value,
        eyeColor: document.getElementById('eyeColor').value,
        skinTone: document.getElementById('skinTone').value,
        faceShape: document.getElementById('faceShape').value,
        distinctiveMarks: document.getElementById('distinctiveMarks').value,
        images
    };

    try {
        const url = performerId ? `/api/performers/${performerId}` : '/api/performers';
        const method = performerId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(performerData)
        });

        if (response.ok) {
            closeModal();
            loadPerformers();
        } else {
            const data = await response.json();
            alert(data.error || 'Failed to save performer');
        }
    } catch (error) {
        alert('Network error. Please try again.');
    }
});

function showDeleteModal(id) {
    deletePerformerId = id;
    deleteStep = 1;
    document.getElementById('deleteStep1').classList.remove('hidden');
    document.getElementById('deleteStep2').classList.add('hidden');
    document.getElementById('deleteConfirm').classList.add('hidden');
    document.getElementById('deleteConfirm').value = '';
    document.getElementById('deleteBtn').textContent = 'Delete';
    document.getElementById('deleteModal').classList.remove('hidden');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.add('hidden');
    deletePerformerId = null;
    deleteStep = 1;
}

function confirmDelete() {
    if (deleteStep === 1) {
        // Move to step 2
        deleteStep = 2;
        document.getElementById('deleteStep1').classList.add('hidden');
        document.getElementById('deleteStep2').classList.remove('hidden');
        document.getElementById('deleteConfirm').classList.remove('hidden');
        document.getElementById('deleteBtn').textContent = 'Confirm Delete';
    } else if (deleteStep === 2) {
        // Check confirmation
        const confirmText = document.getElementById('deleteConfirm').value;
        if (confirmText === 'YES') {
            performDelete();
        } else {
            alert('Please type YES to confirm deletion');
        }
    }
}

async function performDelete() {
    try {
        const response = await fetch(`/api/performers/${deletePerformerId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            closeDeleteModal();
            loadPerformers();
        } else {
            const data = await response.json();
            alert(data.error || 'Failed to delete performer');
        }
    } catch (error) {
        alert('Network error. Please try again.');
    }
}

// Load performers on page load
loadPerformers();
