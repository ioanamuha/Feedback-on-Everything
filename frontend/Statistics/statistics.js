const API_GET_FORM_STATISTICS = "http://127.0.0.1:3000/api/v1/form/statistics";
const API_USER_CONTROLLER = "http://127.0.0.1:3000/api/v1/users/";

let data = {};

async function loadFormStatistics() {
    const savedCurrentUser = localStorage.getItem("user");
    if (!savedCurrentUser) {
        window.location.href = "../index.html";
        return;
    }

    const logoutButton = document.getElementById("logout-button");
	logoutButton.addEventListener("click", () => {
		localStorage.removeItem("user");
		localStorage.removeItem("remember-user-login");
		window.location.href = "../index.html";
	});
        
    const urlParams = new URLSearchParams(window.location.search);
    const formId = urlParams.get('form-id');
    
    if (!formId) {
        console.error("No form ID provided");
        return;
    }
    
    const authToken = JSON.parse(savedCurrentUser).token;
    const currentUserEmail = JSON.parse(savedCurrentUser).email;

    const response = await fetch(API_USER_CONTROLLER + currentUserEmail, {
		headers: {
			authorization: "Bearer " + authToken,
		},
	});

    if (response.status !== 200) {
		document.getElementById("displayed-name").value = "Name not found";
		document.getElementById("displayed-email").value = "Not found :(";
		return;
	}

    const resData = await response.json();
	document.getElementById(
		"displayed-name"
	).innerText = `${resData.user.firstName} ${resData.user.lastName}`;
	document.getElementById("displayed-email").innerText = resData.user.email;

    try {
        const response = await fetch(`${API_GET_FORM_STATISTICS}/${formId}`, {
            headers: {
                authorization: "Bearer " + authToken,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch statistics');
        }

        data = await response.json();
        displayStatistics(data);
    } catch (error) {
        console.error("Error loading form statistics:", error);
    }
}

function displayStatistics(data) {
    document.getElementById('form-title').textContent = data.formTitle;

    document.getElementById('total-responses').textContent = data.totalResponses;

    const ctx = document.getElementById('emotions-chart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(data.emotions),
            datasets: [{
                data: Object.values(data.emotions),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#36A2EB'
                ]
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Emotion Distribution'
            }
        }
    });

    const responsesList = document.getElementById('text-responses');
    responsesList.innerHTML = ''; 
    data.textResponses.forEach(response => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>Emotion:</strong> ${response.emotion}<br>
            <strong>Feedback:</strong> ${response.feedback}<br>
         
        `;
        responsesList.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    function exportToCsv() {
        if (!data) {
            console.error("No data available for export");
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,";

        csvContent += "Emotion,Count\n";

        data.textResponses.forEach((response) => {
            const escapedFeedback = response.feedback.replace(/"/g, '""'); 
            csvContent += `"${response.emotion}","${escapedFeedback}"\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "form_statistics.csv");
        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    }

    document.getElementById('exportCsvButton').addEventListener('click', exportToCsv);

    loadFormStatistics();

    const importFileInput = document.getElementById('importFileInput');
    const importButton = document.getElementById('importButton');

    importButton.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', handleFileImport);

    async function handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('formId', getFormIdFromUrl());

        try {
            const response = await fetch('http://127.0.0.1:3000/api/v1/import-data', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
                }
            });

            if (!response.ok) {
                throw new Error('Import failed');
            }

            const result = await response.json();
            alert(result.message);
            
            loadFormStatistics();
        } catch (error) {
            console.error('Error importing data:', error);
            alert('Failed to import data. Please try again.');
        }

        event.target.value = '';
    }

    function getFormIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('form-id');
    }

});

document.addEventListener('DOMContentLoaded', function() {
    function exportToJson() {
        if (!data) {
            console.error("No data available for export");
            return;
        }

        const exportData = {
            textResponses: data.textResponses,
        };

        const jsonString = JSON.stringify(exportData, null, 2);

        const blob = new Blob([jsonString], {type: "application/json"});

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "form_statistics.json");
        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    
    document.getElementById('exportJsonButton').addEventListener('click', exportToJson);

    loadFormStatistics();
});

document.addEventListener('DOMContentLoaded', loadFormStatistics);