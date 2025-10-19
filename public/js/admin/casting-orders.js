const token = localStorage.getItem('adminToken');
if (!token) {
    window.location.href = '/admin/login';
}

let orders = [];
let currentOrder = null;
let currentPerformer = null;

function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
}

async function loadOrders() {
    try {
        const response = await fetch('/api/client/casting-orders', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        orders = await response.json();
        renderOrders();
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

function renderOrders() {
    const list = document.getElementById('ordersList');

    if (orders.length === 0) {
        list.innerHTML = '<p class="text-center text-gray-500">No casting orders found.</p>';
        return;
    }

    list.innerHTML = orders.map(order => `
        <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-xl font-bold">${order.companyName}</h3>
                    <p class="text-sm text-gray-500">${new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <button onclick="showEmailModal('${order.id}')" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    Send Emails
                </button>
            </div>
            <p class="text-gray-700 mb-4">${order.commercialDescription}</p>
            <div>
                <p class="font-semibold mb-2">Selected Performers (${order.selectedPerformers.length}):</p>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                    ${order.selectedPerformers.map(p => `
                        <div class="text-sm bg-gray-100 p-2 rounded">
                            <p class="font-semibold">${p.firstName} ${p.lastName}</p>
                            <p class="text-xs text-gray-600">${p.email}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function showEmailModal(orderId) {
    currentOrder = orders.find(o => o.id === orderId);
    if (!currentOrder) return;

    const performersList = document.getElementById('performersList');
    performersList.innerHTML = currentOrder.selectedPerformers.map(p => `
        <div class="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
            <div>
                <p class="font-semibold">${p.firstName} ${p.lastName}</p>
                <p class="text-sm text-gray-600">${p.email}</p>
            </div>
            <button onclick="generateEmail('${p.id}')" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                Generate Email
            </button>
        </div>
    `).join('');

    document.getElementById('emailModal').classList.remove('hidden');
}

function closeEmailModal() {
    document.getElementById('emailModal').classList.add('hidden');
    currentOrder = null;
}

async function generateEmail(performerId) {
    currentPerformer = currentOrder.selectedPerformers.find(p => p.id === performerId);
    if (!currentPerformer) return;

    try {
        const response = await fetch('/api/email/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                performerId,
                castingOrderId: currentOrder.id
            })
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('emailRecipient').textContent = `${currentPerformer.firstName} ${currentPerformer.lastName} (${currentPerformer.email})`;
            document.getElementById('emailTextarea').value = data.emailContent;
            document.getElementById('individualEmailModal').classList.remove('hidden');
        } else {
            alert(data.error || 'Failed to generate email');
        }
    } catch (error) {
        alert('Network error. Please try again.');
    }
}

function closeIndividualEmailModal() {
    document.getElementById('individualEmailModal').classList.add('hidden');
    currentPerformer = null;
}

async function sendIndividualEmail() {
    const emailContent = document.getElementById('emailTextarea').value;

    try {
        const response = await fetch('/api/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                performerId: currentPerformer.id,
                emailContent
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            alert('Email sent successfully!');
            closeIndividualEmailModal();
        } else {
            alert(data.error || 'Failed to send email');
        }
    } catch (error) {
        alert('Network error. Please try again.');
    }
}

// Load orders on page load
loadOrders();
