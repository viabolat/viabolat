// JavaScript for Modal
document.addEventListener("DOMContentLoaded", function() {
    var modal = document.getElementById("bookingModal");
    var btn = document.querySelector(".cta-button");
    var span = document.getElementsByClassName("close")[0];

    btn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Form Submission Handling
    document.getElementById("bookingForm").addEventListener("submit", function(event) {
        event.preventDefault();

        // Collect form data
        var formData = new FormData(this);

        // Send form data to the server using fetch
        fetch("submit_form.php", {
            method: "POST",
            body: formData
        })
        .then(response
