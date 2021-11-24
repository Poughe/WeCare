const serviceForm = document.getElementById('service-form');
const serviceId = document.getElementById('service-id');
const serviceAddress = document.getElementById('service-address');

// Send POST to API to add service
async function addService(e) {
    e.preventDefault();

    if (serviceId.value === '' || serviceAddress.value === '') {
        alert('Please fill in fields');
    }

    const sendBody = {
        serviceId: serviceId.value,
        address: serviceAddress.value
    };

    try {
        const res = await fetch('/api/v1/services', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendBody)
        });

        if (res.status === 400) {
            throw Error('You already exist in the community!');
        }

        alert('Welcome to the Community!');
        window.location.href = '/map';
    } catch (err) {
        alert(err);
        return;
    }
}

serviceForm.addEventListener('submit', addService);