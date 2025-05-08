// Fetch recommendation data from localStorage and display it
window.onload = function () {
    const recommendationData = JSON.parse(localStorage.getItem('recommendationData'));

    if (recommendationData) {
        const recommendationDiv = document.getElementById("recommendation");
        if (recommendationDiv) {
            recommendationDiv.innerHTML = `
                <p><strong>Username:</strong> ${recommendationData.username}</p>
                <p><strong>Drug Name:</strong> ${recommendationData.DrugName}</p>
                <p><strong>Dosage:</strong> ${recommendationData.Dosage}</p>
                <p><strong>Lifestyle Advice:</strong> ${recommendationData.LifestyleAdvice}</p>
            `;
        }
    }

    // Handle feedback (store in localStorage or submit it)
    const emojiButtons = document.querySelectorAll(".emoji-button");
    emojiButtons.forEach(button => {
        button.addEventListener("click", function () {
            const feedback = this.dataset.feedback;
            const feedbackMessageDiv = document.getElementById("feedback-message");

            if (feedback === "positive") {
                feedbackMessageDiv.innerHTML = "<p>Thank you for your positive feedback! 😊</p>";
            } else if (feedback === "neutral") {
                feedbackMessageDiv.innerHTML = "<p>Thank you for your neutral feedback! 😐</p>";
            } else if (feedback === "negative") {
                feedbackMessageDiv.innerHTML = "<p>Sorry to hear that! 😞</p>";
            }

            // Optionally, store feedback in localStorage for later submission
            localStorage.setItem('feedback', feedback);
        });
    });
};

// Handle form submission from index.html (Symptom Selection Page)
const recommendationForm = document.getElementById("recommendationForm");
if (recommendationForm) {
    recommendationForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const symptom1 = document.getElementById("symptom1").value;
        const symptom2 = document.getElementById("symptom2").value;

        const data = {
            username: username,
            symptom1: symptom1,
            symptom2: symptom2,
        };

        // Store the data in localStorage
        localStorage.setItem('formData', JSON.stringify(data));

        // Redirect to the medical history page
        window.location.href = "medical-history.html";
    });
}

// Handle form submission from medical-history.html (Medical History Page)
const medicalHistoryForm = document.getElementById("medicalHistoryForm");
if (medicalHistoryForm) {
    medicalHistoryForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Retrieve the data from localStorage
        const formData = JSON.parse(localStorage.getItem('formData'));

        // Get the medical history data
        const medicalHistory = document.getElementById("medicalHistory").value;

        // Combine the data
        const data = {
            ...formData,
            medicalHistory: medicalHistory,
        };

        // Send the combined data to the backend
        fetch("http://127.0.0.1:5000/get_recommendation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(responseData => {
                // Store the received recommendation in localStorage
                localStorage.setItem('recommendationData', JSON.stringify(responseData));
                window.location.href = "recommendation.html"; // Navigate to recommendation page
            })
            .catch(error => {
                console.error("Fetch Error:", error);
            });
    });
}