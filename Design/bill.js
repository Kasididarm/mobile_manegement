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
const billId = params.get('id');

async function loadBill() {
    if (!billId) {
        document.body.insertAdjacentHTML('beforeend', '<p>Missing bill id.</p>');
        return;
    }

    try {
        const data = await api(`${API}/bills/${encodeURIComponent(billId)}/payments`);
        const bill = data.bill;

        document.getElementById('billId').textContent =
            valueOf(bill, 'Bill_ID', 'bill_id');
        document.getElementById('billTotal').textContent =
            valueOf(bill, 'Total_amount', 'total_amount', 'Total_Amount');
        document.getElementById('paidAmount').textContent = data.paid;
        document.getElementById('remainingAmount').textContent = data.remaining;
        document.getElementById('dueDate').textContent =
            formatDate(valueOf(bill, 'Due_date', 'due_date', 'Due_Date'));
        document.getElementById('billStatus').textContent =
            valueOf(bill, 'Status', 'status');

        const table = document.getElementById('paymentTable');
        table.innerHTML = '';

        (data.payments || []).forEach(payment => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${valueOf(payment, 'Payment_ID', 'payment_id')}</td>
                <td>${formatDate(valueOf(payment, 'Payment_date', 'payment_date'))}</td>
                <td>${valueOf(payment, 'Amount', 'amount')}</td>
                <td>${valueOf(payment, 'Payment_method', 'payment_method')}</td>
            `;

            table.appendChild(row);
        });

        if (!(data.payments || []).length) {
            table.innerHTML = '<tr><td colspan="4">No payments</td></tr>';
        }
    } catch (error) {
        alert(`Cannot load bill: ${error.message}`);
    }
}

document.getElementById('paymentForm').addEventListener('submit', async event => {
    event.preventDefault();

    const amount = Number(document.getElementById('paymentAmount').value);
    const method = document.getElementById('paymentMethod').value;

    if (!amount || amount <= 0) {
        alert('Enter a positive payment amount.');
        return;
    }

    try {
        await api(`${API}/payments/pay`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Bill_ID: Number(billId),
                Amount: amount,
                Payment_method: method
            })
        });

        event.target.reset();
        await loadBill();
    } catch (error) {
        alert(`Payment failed: ${error.message}`);
    }
});

loadBill();
