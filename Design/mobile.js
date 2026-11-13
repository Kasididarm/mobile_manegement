const API = '/api';

function valueOf(obj, ...keys) {
    for (const key of keys) {
        if (obj && obj[key] !== undefined && obj[key] !== null) return obj[key];
    }
    return '';
}

function formatDate(value) {
    if (!value) return '';
    return String(value).replace('T', ' ').slice(0, 19);
}

async function api(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        let message = `HTTP ${response.status}`;
        try {
            const data = await response.json();
            message = data.error || message;
        } catch (_) {}
        throw new Error(message);
    }

    if (response.status === 204) return null;
    return response.json();
}

const params = new URLSearchParams(window.location.search);
const phone = params.get('phone');

async function loadPlans() {
    const plans = await api(`${API}/service-plans`);
    const select = document.getElementById('planSelect');

    select.innerHTML = '';

    plans.forEach(plan => {
        const id = valueOf(plan, 'Plan_ID', 'plan_id');
        const name = valueOf(plan, 'Plan_name', 'plan_name');
        const fee = valueOf(plan, 'Monthly_fee', 'monthly_fee');

        const option = document.createElement('option');
        option.value = id;
        option.textContent = `${name} - ${fee}`;
        select.appendChild(option);
    });
}

async function loadMobileDetails() {
    if (!phone) {
        document.body.insertAdjacentHTML('beforeend', '<p>Missing phone number.</p>');
        return;
    }

    try {
        const data = await api(`${API}/mobile-numbers/${encodeURIComponent(phone)}/details`);

        document.getElementById('phoneNumber').textContent =
            valueOf(data, 'Phone_Number', 'phone_number');
        document.getElementById('mobileStatus').textContent =
            valueOf(data, 'Status', 'status');
        document.getElementById('activationDate').textContent =
            formatDate(valueOf(data, 'Activation_date', 'activation_date'));

        const sim = data.sim;
        document.getElementById('simId').textContent =
            sim ? valueOf(sim, 'SIM_ID', 'sim_id') : 'No SIM';
        document.getElementById('simType').textContent =
            sim ? valueOf(sim, 'SIM_Type', 'sim_type') : '-';
        document.getElementById('simStatus').textContent =
            sim ? valueOf(sim, 'Status', 'status') : '-';

        const table = document.getElementById('subscriptionTable');
        table.innerHTML = '';

        const subscriptions = data.subscriptions || [];

        subscriptions.forEach(subscription => {
            const id = valueOf(subscription, 'Subscription_ID', 'subscription_id');
            const status = valueOf(subscription, 'Status', 'status');

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${id}</td>
                <td>${valueOf(subscription, 'Plan_name', 'plan_name')}</td>
                <td>${valueOf(subscription, 'Monthly_fee', 'monthly_fee')}</td>
                <td>${formatDate(valueOf(subscription, 'Start_date', 'start_date'))}</td>
                <td>${formatDate(valueOf(subscription, 'End_date', 'end_date'))}</td>
                <td>${status}</td>
                <td>
                    ${String(status).toLowerCase() === 'active'
                        ? '<button type="button" class="cancelSubscription">Cancel</button>'
                        : '-'}
                </td>
            `;

            const cancelButton = row.querySelector('.cancelSubscription');
            if (cancelButton) {
                cancelButton.addEventListener('click', async () => {
                    if (!confirm(`Cancel subscription ${id}?`)) return;

                    const today = new Date().toISOString().slice(0, 10);

                    try {
                        await api(`${API}/subscriptions/${encodeURIComponent(id)}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                Status: 'Inactive',
                                End_date: today
                            })
                        });

                        await loadMobileDetails();
                    } catch (error) {
                        alert(`Cancel failed: ${error.message}`);
                    }
                });
            }

            table.appendChild(row);
        });

        if (!subscriptions.length) {
            table.innerHTML = '<tr><td colspan="7">No subscriptions</td></tr>';
        }
    } catch (error) {
        alert(`Cannot load mobile details: ${error.message}`);
    }
}

document.getElementById('subscriptionForm').addEventListener('submit', async event => {
    event.preventDefault();

    if (!phone) return;

    const planId = document.getElementById('planSelect').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!planId || !startDate || !endDate) {
        alert('Please select a plan and enter start/end dates.');
        return;
    }

    try {
        await api(`${API}/subscriptions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Plan_ID: Number(planId),
                Phone_Number: phone,
                Start_date: startDate,
                End_date: endDate,
                Status: 'Active'
            })
        });

        event.target.reset();
        await loadMobileDetails();
    } catch (error) {
        alert(`Subscribe failed: ${error.message}`);
    }
});

const simForm = document.getElementById('simForm');

if (simForm) {
    simForm.addEventListener('submit', async event => {
        event.preventDefault();

        if (!phone) {
            alert('Missing phone number.');
            return;
        }

        const simType =
            document.getElementById('simTypeInput').value;

        const simStatus =
            document.getElementById('simStatusInput').value;

        try {
            await api(`${API}/sim-cards`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Phone_Number: phone,
                    SIM_Type: simType,
                    Status: simStatus
                })
            });

            alert('SIM card assigned successfully.');

            await loadMobileDetails();

        } catch (error) {
            alert(`Assign SIM failed: ${error.message}`);
        }
    });
}

Promise.all([loadPlans(), loadMobileDetails()]).catch(error => {
    console.error(error);
});
