AOS.init({
    // once: true,
});

// const map = L.map('map').setView([-2.5489, 118.0149], 6);
const map = L.map('map').setView([-2.0000, 118.0000], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

const locations = [
    { name: "Jakarta", lat: -6.2088, lng: 106.8456, volunteers: 8 },
    { name: "Karawang", lat: -6.3146, lng: 107.3094, volunteers: 1 },
    { name: "Medan", lat: 3.5952, lng: 98.6722, volunteers: 1 },
    { name: "Jakarta Timur", lat: -6.2307, lng: 106.8967, volunteers: 2 },
    { name: "Malang", lat: -7.9826, lng: 112.6308, volunteers: 3 },
    { name: "Jakarta Selatan", lat: -6.2615, lng: 106.8106, volunteers: 2 },
    { name: "Arcamanik, Bandung", lat: -6.9175, lng: 107.6191, volunteers: 1 },
    { name: "Depok", lat: -6.4025, lng: 106.8048, volunteers: 3 },
    { name: "Bogor", lat: -6.5950, lng: 106.7997, volunteers: 4 },
    { name: "Bangka", lat: -2.3216, lng: 106.1086, volunteers: 1 }, // Mengacu pada Bangka Belitung secara umum
    { name: "West Java", lat: -6.9034, lng: 107.6046, volunteers: 1 }, // Mengacu pada Bandung sebagai pusat West Java
    { name: "Palembang", lat: -2.9761, lng: 104.7754, volunteers: 1 },
    { name: "Sunter, Jakarta Utara", lat: -6.1360, lng: 106.8778, volunteers: 1 },
    { name: "Purwokerto", lat: -7.4239, lng: 109.2215, volunteers: 1 },
    { name: "Cikarang", lat: -6.2737, lng: 107.1352, volunteers: 1 },
    { name: "Bekasi", lat: -6.2369, lng: 106.9715, volunteers: 3 },
    { name: "Tuban, East Java", lat: -6.9079, lng: 112.0560, volunteers: 1 },
    { name: "Sumedang, Jatinangor", lat: -6.9329, lng: 107.7667, volunteers: 1 },
    { name: "Gresik", lat: -7.1666, lng: 112.6568, volunteers: 1 },
    { name: "Purbalingga", lat: -7.3707, lng: 109.3582, volunteers: 1 },
    { name: "Jakarta Barat", lat: -6.1754, lng: 106.8272, volunteers: 1 },
    { name: "Aceh", lat: 5.5524, lng: 95.3188, volunteers: 1 }, // Mengacu pada Banda Aceh sebagai ibukota
    { name: "Batang, Jawa Tengah", lat: -7.0094, lng: 109.7368, volunteers: 1 },
    { name: "Bandung", lat: -6.9175, lng: 107.6191, volunteers: 2 },
    { name: "Surabaya", lat: -7.2504, lng: 112.7688, volunteers: 1 },
    { name: "Bali", lat: -8.4095, lng: 115.1889, volunteers: 1 }, // Mengacu pada Bali secara umum
    { name: "Surakarta", lat: -7.5559, lng: 110.8200, volunteers: 1 },
    { name: "Pekanbaru", lat: 0.5071, lng: 101.4478, volunteers: 1 },
    { name: "South Tangerang", lat: -6.2878, lng: 106.7323, volunteers: 1 },
    //{ name: "South Jakarta", lat: -6.2615, lng: 106.8106, volunteers: 1 },
    { name: "Kendari", lat: -3.9806, lng: 122.5160, volunteers: 1 }
];

// FAQ Toggle Functionality
const toggles = document.querySelectorAll(".faq-toggle");

toggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const faqItem = toggle.parentElement;
    const isActive = faqItem.classList.contains("active");
    
    // Logic Close Other FAQ
    document.querySelectorAll(".faq").forEach(item => {
      if (item !== faqItem && item.classList.contains("active")) {
        item.classList.remove("active");
      }
    });
    
    // Toggle current FAQ
    faqItem.classList.toggle("active");
    
    // Arrow Animation
    const chevron = toggle.querySelector(".fa-chevron-down");
    if (chevron) {
      if (!isActive) {
        chevron.style.transform = "rotate(180deg)";
      } else {
        chevron.style.transform = "rotate(0deg)";
      }
    }
  });
});

locations.forEach(loc => {
    L.marker([loc.lat, loc.lng])
        .addTo(map)
        .bindPopup(`<strong>${loc.name}</strong><br>Volunteers: ${loc.volunteers}`);
});