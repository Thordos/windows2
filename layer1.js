document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.property-card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const type = card.getAttribute('data-type');
            const selectedData = {
                type: type
            };
            localStorage.setItem('selectedProperty', JSON.stringify(selectedData));
            window.location.href = 'locations.html'; // هنعملها بعد كده
        });
    });
});
