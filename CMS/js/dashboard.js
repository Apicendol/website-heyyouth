(function () {
    'use strict';

    /* =========================================
       AUTH CHECK
       ========================================= */
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            window.location.href = 'Login.html';
        } else {
            document.body.style.display = 'block';
            initDashboard();
        }
    });

    if (!localStorage.getItem('hey_youth_cms_v2_fixed')) {
        localStorage.removeItem('hey_youth_cms');
        localStorage.setItem('hey_youth_cms_v2_fixed', 'true');
    }

    /* =========================================
       CONSTANTS & WRITE METHODS
       ========================================= */
    var CMS_KEY = 'hey_youth_cms';

    // Expose write method inside the dashboard scope
    window.saveFirebaseData = async function(data) {
        return db.collection('heyyouth').doc('cms_data').set(data);
    };

    /* =========================================
       DATA LAYER
       ========================================= */
    var memoryData = null;

    function _resolveImgPath(path) {
        if (!path) return '';
        if (path.indexOf('data:') === 0 || path.indexOf('http') === 0 || path.indexOf('//') === 0 || path.indexOf('blob:') === 0) {
            return path;
        }
        var cleanPath = path;
        if (cleanPath.indexOf('../assets/') === 0) {
            cleanPath = cleanPath.substring(10);
        } else if (cleanPath.indexOf('assets/') === 0) {
            cleanPath = cleanPath.substring(7);
        } else if (cleanPath.indexOf('../') === 0) {
            cleanPath = cleanPath.substring(3);
        }
        if (cleanPath.indexOf('img/') !== 0) {
            cleanPath = 'img/' + cleanPath;
        }
        return '../assets/' + cleanPath;
    }

    function getData() {
        if (memoryData) return JSON.parse(JSON.stringify(memoryData));
        return JSON.parse(JSON.stringify(window.HEY_YOUTH_DEFAULT_DATA));
    }

    async function saveData(data) {
        memoryData = JSON.parse(JSON.stringify(data));
        try {
            await window.saveFirebaseData(data);
            return true;
        } catch (e) {
            showToast('Gagal menyimpan ke database.', 'error');
            return false;
        }
    }

    /* =========================================
       STATE
       ========================================= */
    var editingItem = null;
    var editingSection = null;
    var deletingId = null;
    var deletingSection = null;
    var uploadedImage = null;
    var uploadedQrisImage = null;

    /* =========================================
       SIDEBAR & NAVIGATION
       ========================================= */
    window.switchTab = function (tab) {
        editingItem = null;
        editingSection = null;

        document.querySelectorAll('.sidebar-link').forEach(function (el) {
            el.classList.toggle('active', el.getAttribute('data-tab') === tab);
        });

        document.getElementById('view-homepage').classList.add('hidden');
        document.getElementById('view-about').classList.add('hidden');
        document.getElementById('view-activities').classList.add('hidden');
        document.getElementById('view-partners').classList.add('hidden');
        document.getElementById('view-donation').classList.add('hidden');

        if (tab === 'homepage') {
            document.getElementById('view-homepage').classList.remove('hidden');
            document.getElementById('page-title').textContent = 'Homepage';
            document.getElementById('page-desc').textContent = 'Kelola seluruh konten yang tampil di beranda dan analisis kunjungan';
            if (lastStatsData) {
                updateStatisticsUI(lastStatsData);
            }
        } else if (tab === 'about') {
            document.getElementById('view-about').classList.remove('hidden');
            document.getElementById('page-title').textContent = 'About Us';
            document.getElementById('page-desc').textContent = 'Kelola profil organisasi dan tim inti';
            renderAboutPreview();
        } else if (tab === 'activities') {
            document.getElementById('view-activities').classList.remove('hidden');
            document.getElementById('page-title').textContent = 'Activities';
            document.getElementById('page-desc').textContent = 'Kelola berita kegiatan dan episode podcast terbaru';
        } else if (tab === 'partners') {
            document.getElementById('view-partners').classList.remove('hidden');
            document.getElementById('page-title').textContent = 'Partners';
            document.getElementById('page-desc').textContent = 'Kelola daftar mitra dan kolaborator organisasi';
        } else if (tab === 'donation') {
            document.getElementById('view-donation').classList.remove('hidden');
            document.getElementById('page-title').textContent = 'Donation Page';
            document.getElementById('page-desc').textContent = 'Kelola konten halaman donasi';
            renderDonationPreview();
        }

        renderAllLists();
        closeSidebar();
    };

    function renderAllLists() {
        var data = getData();
        renderTestimonials('list-external', data.externalTestimonials, 'external');
        renderTestimonials('list-internal', data.internalTestimonials, 'internal');
        renderFaqs(data.faqs);
        renderLocations(data.locations);
        renderTeam(data.team);
        renderActivityCards(data.activityCards);
        renderPodcasts(data.podcasts);
        renderPartners(data.partners);
        updateCounts(data);
    }

    window.closeSidebar = function () {
        document.getElementById('sidebar').classList.add('-translate-x-full');
        document.getElementById('sidebar-backdrop').classList.add('hidden');
    };

    document.getElementById('sidebar-toggle').addEventListener('click', function () {
        document.getElementById('sidebar').classList.remove('-translate-x-full');
        document.getElementById('sidebar-backdrop').classList.remove('hidden');
    });

    /* =========================================
       COUNTS
       ========================================= */
    function updateCounts(data) {
        var ext = (data.externalTestimonials || []).length;
        var int = (data.internalTestimonials || []).length;
        var faq = (data.faqs || []).length;
        var loc = (data.locations || []).length;
        var team = (data.team || []).length;
        var actCards = (data.activityCards || []).length;
        var pods = (data.podcasts || []).length;
        var partners = (data.partners || []).length;

        document.getElementById('count-external').textContent = ext;
        document.getElementById('count-internal').textContent = int;
        document.getElementById('count-faq').textContent = faq;
        document.getElementById('count-locations').textContent = loc;
        document.getElementById('count-team').textContent = team;

        document.getElementById('count-activity-cards').textContent = actCards;
        document.getElementById('count-podcasts').textContent = pods;
        document.getElementById('count-partners').textContent = partners;
        document.getElementById('count-partners-list').textContent = partners;

        document.getElementById('count-homepage').textContent = ext + int + faq + loc;
        document.getElementById('count-about').textContent = team + 1;
        document.getElementById('count-activities').textContent = actCards + pods;
    }

    /* =========================================
       IMAGE UPLOAD & COMPRESSION
       ========================================= */
    function compressImage(file, maxWidth, quality, callback) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var img = new Image();
            img.onload = function () {
                var canvas = document.createElement('canvas');
                var w = img.width;
                var h = img.height;
                if (w > maxWidth) {
                    h = Math.round((maxWidth / w) * h);
                    w = maxWidth;
                }
                canvas.width = w;
                canvas.height = h;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);
                callback(canvas.toDataURL('image/jpeg', quality));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function triggerUpload(targetType) {
        var input = document.getElementById('file-input-hidden');
        input.value = '';
        input.onchange = function () {
            var file = input.files[0];
            if (!file) return;
            if (!file.type.startsWith('image/')) {
                showToast('File harus berupa gambar.', 'error');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                showToast('Ukuran file maksimal 10MB.', 'error');
                return;
            }

            var zoneId = (targetType === 'qris') ? 'upload-zone-qris' : 'upload-zone';
            var zone = document.getElementById(zoneId);

            if (zone) {
                zone.innerHTML = '<div class="py-6 text-center text-gray-400"><i class="fas fa-spinner fa-spin text-2xl mb-2 block"></i><p class="text-xs">Memproses gambar...</p></div>';
            }
            compressImage(file, 400, 0.7, function (base64) {
                if (targetType === 'qris') {
                    uploadedQrisImage = base64;
                    updateUploadPreviewQris(base64);
                } else {
                    uploadedImage = base64;
                    updateUploadPreview(base64);
                }
            });
        };
        input.click();
    }

    function updateUploadPreview(src) {
        var zone = document.getElementById('upload-zone');
        if (!zone) return;
        zone.innerHTML =
            '<div class="relative">' +
            '<img src="' + src + '" alt="Preview" class="w-full h-40 object-contain rounded-lg bg-gray-50">' +
            '<button type="button" onclick="removeUpload()" class="absolute top-1 right-1 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow-md transition-colors"><i class="fas fa-times"></i></button>' +
            '</div>' +
            '<p class="text-xs text-green-600 font-medium mt-2"><i class="fas fa-check-circle mr-1"></i>Gambar berhasil diupload</p>';
    }

    function updateUploadPreviewQris(src) {
        var zone = document.getElementById('upload-zone-qris');
        if (!zone) return;
        zone.innerHTML =
            '<div class="relative">' +
            '<img src="' + src + '" alt="Preview QRIS" class="w-24 h-24 object-contain mx-auto bg-gray-50 rounded">' +
            '<button type="button" onclick="removeUploadQris()" class="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-xs shadow-md"><i class="fas fa-times"></i></button>' +
            '</div>' +
            '<p class="text-xs text-green-600 font-medium mt-2 text-center">QRIS Uploaded</p>';
    }

    window.removeUpload = function () {
        uploadedImage = null;
        var zone = document.getElementById('upload-zone');
        if (!zone) return;
        zone.innerHTML =
            '<div class="py-6 text-center">' +
            '<i class="fas fa-cloud-upload-alt text-3xl text-gray-300 mb-2 block"></i>' +
            '<p class="text-sm text-gray-500 font-medium">Klik atau seret gambar ke sini</p>' +
            '<p class="text-xs text-gray-400 mt-1">JPEG, PNG, WebP — Maks 10MB</p>' +
            '</div>';
    };

    window.removeUploadQris = function () {
        uploadedQrisImage = null;
        var zone = document.getElementById('upload-zone-qris');
        if (!zone) return;
        zone.innerHTML =
            '<div class="py-4 text-center text-gray-400 text-sm border border-dashed border-gray-300 rounded">' +
            '<i class="fas fa-qrcode text-2xl mb-1"></i>' +
            '<p>Upload QRIS</p>' +
            '</div>';
    };

    function initDragDrop(targetType) {
        var zoneId = (targetType === 'qris') ? 'upload-zone-qris' : 'upload-zone';
        var zone = document.getElementById(zoneId);
        if (!zone) return;

        var clickHandler = (function (z, t) {
            return function () { triggerUpload(t); };
        })(zone, targetType);

        if (!zone.hasClickEvent) {
            zone.addEventListener('click', clickHandler);
            zone.hasClickEvent = true;
        }

        zone.addEventListener('dragover', function (e) {
            e.preventDefault();
            zone.classList.add('dragover');
        });
        zone.addEventListener('dragleave', function () {
            zone.classList.remove('dragover');
        });
        zone.addEventListener('drop', function (e) {
            e.preventDefault();
            zone.classList.remove('dragover');
            var file = e.dataTransfer.files[0];
            if (!file || !file.type.startsWith('image/')) {
                showToast('File harus berupa gambar.', 'error');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                showToast('Ukuran file maksimal 10MB.', 'error');
                return;
            }

            var loadingHtml = '<div class="py-6 text-center text-gray-400"><i class="fas fa-spinner fa-spin text-2xl mb-2 block"></i><p class="text-xs">Memproses gambar...</p></div>';
            zone.innerHTML = loadingHtml;

            compressImage(file, 400, 0.7, function (base64) {
                if (targetType === 'qris') {
                    uploadedQrisImage = base64;
                    updateUploadPreviewQris(base64);
                } else {
                    uploadedImage = base64;
                    updateUploadPreview(base64);
                }
            });
        });
    }

    function initCmsMap(item) {
        var defaultLat = -6.2088;
        var defaultLng = 106.8456;

        var lat = item ? item.lat : defaultLat;
        var lng = item ? item.lng : defaultLng;

        setTimeout(function () {
            var mapContainer = document.getElementById('map-cms');
            if (!mapContainer || typeof L === 'undefined') return;

            var map = L.map('map-cms').setView([lat, lng], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap'
            }).addTo(map);

            var marker = L.marker([lat, lng], {
                draggable: true
            }).addTo(map);

            function updateCoords(newLat, newLng) {
                var latEl = document.getElementById('f-lat');
                var lngEl = document.getElementById('f-lng');
                if (latEl) latEl.value = newLat.toFixed(6);
                if (lngEl) lngEl.value = newLng.toFixed(6);
            }

            marker.on('dragend', function (e) {
                var position = marker.getLatLng();
                updateCoords(position.lat, position.lng);
            });

            map.on('click', function (e) {
                marker.setLatLng(e.latlng);
                updateCoords(e.latlng.lat, e.latlng.lng);
            });

            if (!item) {
                updateCoords(lat, lng);
            }

            var nameInput = document.getElementById('f-name');
            var searchTimeout = null;

            if (nameInput) {
                nameInput.addEventListener('input', function () {
                    clearTimeout(searchTimeout);
                    var query = nameInput.value.trim();
                    if (query.length < 3) return;

                    searchTimeout = setTimeout(function () {
                        fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query), {
                            headers: {
                                'User-Agent': 'HeyYouthCMS/1.0 (hey.youth.id@gmail.com)'
                            }
                        })
                            .then(response => response.json())
                            .then(data => {
                                if (data && data.length > 0) {
                                    var found = data[0];
                                    var newLat = parseFloat(found.lat);
                                    var newLng = parseFloat(found.lon);

                                    map.setView([newLat, newLng], 13);
                                    marker.setLatLng([newLat, newLng]);
                                    updateCoords(newLat, newLng);
                                }
                            })
                            .catch(err => console.error('Geocoding error:', err));
                    }, 1000);
                });
            }

            setTimeout(function () { map.invalidateSize(); }, 400);
        }, 300);
    }

    /* =========================================
       RENDER FUNCTIONS
       ========================================= */
    function renderTestimonials(containerId, items, type) {
        var container = document.getElementById(containerId);
        items = items || [];
        if (items.length === 0) {
            container.innerHTML = '<div class="col-span-full text-center py-16 text-gray-400"><i class="fas fa-inbox text-4xl mb-3 block"></i><p>Belum ada data. Klik "Tambah" untuk menambahkan.</p></div>';
            return;
        }
        container.innerHTML = items.map(function (item) {
            var imgSrc = item.image || '';
            var isBase64 = imgSrc && imgSrc.startsWith('data:');
            var displaySrc = _resolveImgPath(imgSrc);
            var fallback = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(item.name) + '&size=100&background=random&color=fff';
            var subtitle = type === 'external' ? item.title : item.role;
            var badge = isBase64 ? '<span class="text-[9px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full font-medium">uploaded</span>' : '';
            return '<div class="cms-card bg-white rounded-xl border border-gray-200 p-5 flex flex-col">' +
                '<div class="flex items-start gap-3 mb-3">' +
                '<img src="' + escapeAttr(displaySrc) + '" alt="' + escapeAttr(item.name) + '" class="w-11 h-11 rounded-full object-cover border-2 border-gray-100 flex-shrink-0" onerror="this.src=\'' + fallback + '\'">' +
                '<div class="min-w-0">' +
                '<div class="flex items-center gap-1.5">' +
                '<h4 class="font-bold text-heading text-sm truncate">' + escapeHtml(item.name) + '</h4>' +
                badge +
                '</div>' +
                '<p class="text-xs text-gray-500 truncate">' + escapeHtml(subtitle || '') + '</p>' +
                '</div>' +
                '</div>' +
                '<p class="text-sm text-gray-600 italic flex-grow line-clamp-3">"' + escapeHtml(item.quote) + '"</p>' +
                '<div class="flex gap-2 mt-4 pt-3 border-t border-gray-100">' +
                '<button onclick="openEditModal(\'' + type + '\',' + item.id + ')" class="flex-1 text-xs font-semibold text-primary hover:bg-blue-50 py-2 rounded-lg transition-colors"><i class="fas fa-pen mr-1"></i> Edit</button>' +
                '<button onclick="confirmDelete(\'' + type + '\',' + item.id + ')" class="flex-1 text-xs font-semibold text-red-500 hover:bg-red-50 py-2 rounded-lg transition-colors"><i class="fas fa-trash mr-1"></i> Hapus</button>' +
                '</div>' +
                '</div>';
        }).join('');
    }

    function renderFaqs(items) {
        var container = document.getElementById('list-faq');
        items = items || [];
        if (items.length === 0) {
            container.innerHTML = '<div class="text-center py-16 text-gray-400"><i class="fas fa-inbox text-4xl mb-3 block"></i><p>Belum ada data. Klik "Tambah" untuk menambahkan.</p></div>';
            return;
        }
        container.innerHTML = items.map(function (item) {
            return '<div class="cms-card bg-white rounded-xl border border-gray-200 p-5">' +
                '<div class="flex items-start justify-between gap-3">' +
                '<div class="min-w-0 flex-grow">' +
                '<h4 class="font-bold text-heading text-sm mb-1">' + escapeHtml(item.question) + '</h4>' +
                '<p class="text-xs text-gray-500 line-clamp-2">' + escapeHtml(item.answer) + '</p>' +
                '</div>' +
                '<div class="flex gap-1 flex-shrink-0">' +
                '<button onclick="openEditModal(\'faq\',' + item.id + ')" class="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><i class="fas fa-pen text-xs"></i></button>' +
                '<button onclick="confirmDelete(\'faq\',' + item.id + ')" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus"><i class="fas fa-trash text-xs"></i></button>' +
                '</div>' +
                '</div>' +
                '</div>';
        }).join('');
    }

    function renderLocations(items) {
        var tbody = document.getElementById('list-locations');
        items = items || [];
        if (items.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center py-16 text-gray-400"><i class="fas fa-inbox text-4xl mb-3 block"></i><p>Belum ada data.</p></td></tr>';
            return;
        }
        tbody.innerHTML = items.map(function (item, idx) {
            return '<tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">' +
                '<td class="px-4 py-3 text-gray-400">' + (idx + 1) + '</td>' +
                '<td class="px-4 py-3 font-medium text-heading">' + escapeHtml(item.name) + '</td>' +
                '<td class="px-4 py-3 text-gray-500 font-mono text-xs">' + item.lat + '</td>' +
                '<td class="px-4 py-3 text-gray-500 font-mono text-xs">' + item.lng + '</td>' +
                '<td class="px-4 py-3"><span class="bg-accent/10 text-accent text-xs font-bold px-2 py-1 rounded-full">' + item.volunteers + '</span></td>' +
                '<td class="px-4 py-3 text-right">' +
                '<button onclick="openEditModal(\'locations\',' + item.id + ')" class="p-1.5 text-primary hover:bg-blue-50 rounded-lg transition-colors mr-1" title="Edit"><i class="fas fa-pen text-xs"></i></button>' +
                '<button onclick="confirmDelete(\'locations\',' + item.id + ')" class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus"><i class="fas fa-trash text-xs"></i></button>' +
                '</td>' +
                '</tr>';
        }).join('');
    }

    function renderTeam(items) {
        var container = document.getElementById('list-team');
        items = items || [];
        if (items.length === 0) {
            container.innerHTML = '<div class="col-span-full text-center py-16 text-gray-400"><i class="fas fa-inbox text-4xl mb-3 block"></i><p>Belum ada data tim.</p></div>';
            return;
        }
        container.innerHTML = items.map(function (item) {
            var imgSrc = item.image || '';
            var isBase64 = imgSrc && imgSrc.startsWith('data:');
            var displaySrc = _resolveImgPath(imgSrc);
            var fallback = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(item.name) + '&size=100&background=random&color=fff';
            var badge = isBase64 ? '<span class="text-[9px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full font-medium">uploaded</span>' : '';

            return '<div class="cms-card bg-white rounded-xl border border-gray-200 p-5 flex flex-col items-center text-center">' +
                '<div class="relative mb-3">' +
                '<img src="' + escapeAttr(displaySrc) + '" alt="' + escapeAttr(item.name) + '" class="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md" onerror="this.src=\'' + fallback + '\'">' +
                badge +
                '</div>' +
                '<h4 class="font-bold text-heading text-sm truncate w-full">' + escapeHtml(item.name) + '</h4>' +
                '<p class="text-xs text-primary font-semibold mb-3">' + escapeHtml(item.role) + '</p>' +
                '<div class="flex gap-2 mt-auto w-full">' +
                '<button onclick="openEditModal(\'team\',' + item.id + ')" class="flex-1 text-xs font-semibold text-primary hover:bg-blue-50 py-2 rounded-lg transition-colors"><i class="fas fa-pen mr-1"></i> Edit</button>' +
                '<button onclick="confirmDelete(\'team\',' + item.id + ')" class="flex-1 text-xs font-semibold text-red-500 hover:bg-red-50 py-2 rounded-lg transition-colors"><i class="fas fa-trash mr-1"></i> Hapus</button>' +
                '</div>' +
                '</div>';
        }).join('');
    }

    function renderActivityCards(items) {
        var container = document.getElementById('list-activity-cards');
        items = items || [];
        if (items.length === 0) {
            container.innerHTML = '<div class="col-span-full text-center py-10 text-gray-400"><p>Belum ada activity card.</p></div>';
            return;
        }
        container.innerHTML = items.map(function (item) {
            var imgSrc = item.image ? _resolveImgPath(item.image) : 'https://via.placeholder.com/400x250?text=No+Image';
            var badgeColor = item.category === 'Education' ? 'bg-primary/90' : 'bg-accent/90';

            return '<div class="cms-card bg-white rounded-xl border border-gray-200 p-4 flex flex-col">' +
                '<div class="relative h-32 w-full rounded-lg overflow-hidden mb-3 bg-gray-100">' +
                '<img src="' + escapeAttr(imgSrc) + '" class="w-full h-full object-cover">' +
                '<span class="absolute top-2 left-2 ' + badgeColor + ' text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">' + escapeHtml(item.category) + '</span>' +
                '</div>' +
                '<h4 class="font-bold text-heading text-sm line-clamp-2 h-10">' + escapeHtml(item.title) + '</h4>' +
                '<div class="mt-auto pt-3 flex gap-2">' +
                '<button onclick="openEditModal(\'activity-card\',' + item.id + ')" class="flex-1 text-xs font-semibold text-primary hover:bg-blue-50 py-1.5 rounded transition-colors">Edit</button>' +
                '<button onclick="confirmDelete(\'activity-card\',' + item.id + ')" class="flex-1 text-xs font-semibold text-red-500 hover:bg-red-50 py-1.5 rounded transition-colors">Hapus</button>' +
                '</div>' +
                '</div>';
        }).join('');
    }

    function renderPodcasts(items) {
        var container = document.getElementById('list-podcasts');
        items = items || [];
        if (items.length === 0) {
            container.innerHTML = '<div class="col-span-full text-center py-10 text-gray-400"><p>Belum ada podcast.</p></div>';
            return;
        }
        container.innerHTML = items.map(function (item) {
            var imgSrc = item.thumbnail ? _resolveImgPath(item.thumbnail) : 'https://via.placeholder.com/150?text=No+Img';
            var fallback = 'https://via.placeholder.com/150?text=No+Img';

            return '<div class="cms-card bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">' +
                '<div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">' +
                '<img src="' + escapeAttr(imgSrc) + '" class="w-full h-full object-cover" onerror="this.src=\'' + fallback + '\'">' +
                '</div>' +
                '<div class="flex-grow min-w-0">' +
                '<div class="text-[10px] font-bold text-accent uppercase tracking-wide">' + escapeHtml(item.episode) + '</div>' +
                '<h4 class="font-bold text-heading text-sm truncate">' + escapeHtml(item.title) + '</h4>' +
                '<div class="text-[10px] text-gray-400 truncate mt-1"><i class="fas fa-link mr-1"></i>' + (item.spotifyLink ? item.spotifyLink : 'No Link') + '</div>' +
                '</div>' +
                '<div class="flex gap-2 flex-shrink-0">' +
                '<button onclick="openEditModal(\'podcast\',' + item.id + ')" class="p-1.5 text-primary hover:bg-blue-50 rounded-lg transition-colors"><i class="fas fa-pen text-xs"></i></button>' +
                '<button onclick="confirmDelete(\'podcast\',' + item.id + ')" class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><i class="fas fa-trash text-xs"></i></button>' +
                '</div>' +
                '</div>';
        }).join('');
    }

    function renderPartners(items) {
        var container = document.getElementById('list-partners');
        if (!items || items.length === 0) {
            container.innerHTML = '<div class="col-span-full text-center py-10 text-gray-400"><p>Belum ada data partner.</p></div>';
            return;
        }

        var colorMap = {
            'blue': 'bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white',
            'pink': 'bg-pink-50 text-pink-500 hover:bg-pink-500 hover:text-white',
            'purple': 'bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white',
            'green': 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white',
            'yellow': 'bg-yellow-50 text-yellow-600 hover:bg-yellow-600 hover:text-white',
            'gray': 'bg-gray-100 text-gray-500 hover:bg-gray-500 hover:text-white',
        };

        container.innerHTML = items.map(function (item) {
            var colorClass = colorMap[item.color] || colorMap['blue'];
            var logoHtml = '';

            if (item.image) {
                var imgSrc = _resolveImgPath(item.image);
                logoHtml = '<div class="w-16 h-16 rounded-xl overflow-hidden mb-4 bg-white border border-gray-100 shadow-sm flex items-center justify-center p-2">' +
                    '<img src="' + escapeAttr(imgSrc) + '" class="max-w-full max-h-full object-contain">' +
                    '</div>';
            } else {
                logoHtml = '<div class="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4 transition-all duration-300 ' + colorClass + '">' +
                    '<i class="fas ' + (item.icon || 'fa-building') + '"></i>' +
                    '</div>';
            }

            return '<div class="cms-card bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center text-center group h-full">' +
                logoHtml +
                '<h4 class="font-bold text-heading text-lg mb-2">' + escapeHtml(item.name) + '</h4>' +
                '<p class="text-sm text-gray-500 mb-6 flex-grow line-clamp-2">' + escapeHtml(item.description) + '</p>' +
                '<div class="flex gap-2 w-full mt-auto">' +
                '<button onclick="openEditModal(\'partner\',' + item.id + ')" class="flex-1 text-xs font-semibold text-primary hover:bg-blue-50 py-2 rounded-lg transition-colors"><i class="fas fa-pen mr-1"></i> Edit</button>' +
                '<button onclick="confirmDelete(\'partner\',' + item.id + ')" class="flex-1 text-xs font-semibold text-red-500 hover:bg-red-50 py-2 rounded-lg transition-colors"><i class="fas fa-trash mr-1"></i> Hapus</button>' +
                '</div>' +
                '</div>';
        }).join('');
    }

    function renderAboutPreview() {
        var data = getData();
        var hero = data.aboutHero;
        var el = document.getElementById('preview-about-hero');
        if (!el) return;
        el.innerHTML =
            '<div class="flex gap-4 mb-4">' +
            '<img src="' + (hero.image ? _resolveImgPath(hero.image) : 'https://via.placeholder.com/150') + '" class="w-24 h-24 object-cover rounded-lg shadow-sm">' +
            '<div class="flex-1">' +
            '<h3 class="text-xl font-bold text-heading mb-1 leading-tight">' + hero.title + '</h3>' +
            '<p class="text-xs text-gray-500 line-clamp-2">' + hero.subtitle + '</p>' +
            '</div>' +
            '</div>' +
            '<div class="text-xs text-gray-400">Badge Relawan: ' + hero.volunteerCount + '</div>';
    }

    function renderDonationPreview() {
        var data = getData();
        var s = data.donationSettings;
        var el = document.getElementById('preview-donation');
        if (!el) return;

        el.innerHTML =
            '<div class="grid grid-cols-2 gap-4 text-sm">' +
            '<div><strong>Hero Title:</strong><br>' + _esc(s.heroTitle) + '</div>' +
            '<div><strong>Strip Text:</strong><br>' + _esc(s.stripText) + '</div>' +
            '<div class="col-span-2"><strong>Bank Info:</strong> ' + _esc(s.bankName) + ' - ' + _esc(s.accountNumber) + '</div>' +
            '</div>';
    }

    function _esc(str) {
        if (!str) return '';
        return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    /* =========================================
       MODAL — OPEN ADD
       ========================================= */
    window.openAddModal = function (section) {
        editingItem = null;
        editingSection = section;
        uploadedImage = null;
        uploadedQrisImage = null;
        renderModalForm(section, null);
        openModal();
    };

    window.openEditModal = function (section, id) {
        var data = getData();
        var list;
        var item = null;

        if (section === 'about-hero') {
            item = data.aboutHero;
        } else if (section === 'donation-settings') {
            item = data.donationSettings;
        } else {
            switch (section) {
                case 'external': list = data.externalTestimonials; break;
                case 'internal': list = data.internalTestimonials; break;
                case 'faq': list = data.faqs; break;
                case 'locations': list = data.locations; break;
                case 'team': list = data.team; break;
                case 'activity-card': list = data.activityCards; break;
                case 'podcast': list = data.podcasts; break;
                case 'partner': list = data.partners; break;
            }
            list = list || [];
            item = list.find(function (i) { return i.id === id; });
        }

        if (!item) return;
        editingItem = item;
        editingSection = section;

        uploadedImage = (item.image && item.image.startsWith('data:')) ? item.image : null;
        if (section === 'podcast' && item.thumbnail) {
            uploadedImage = (item.thumbnail && item.thumbnail.startsWith('data:')) ? item.thumbnail : null;
        }
        if (section === 'donation-settings' && item.qrisImage) {
            uploadedQrisImage = item.qrisImage.startsWith('data:') ? item.qrisImage : null;
        } else {
            uploadedQrisImage = null;
        }

        renderModalForm(section, item);
        openModal();
    };

    /* =========================================
       MODAL — RENDER FORM
       ========================================= */
    function renderModalForm(section, item) {
        var isEdit = !!item;
        var label;
        if (section === 'external' || section === 'internal') label = 'Testimoni';
        else if (section === 'faq') label = 'FAQ';
        else if (section === 'locations') label = 'Lokasi';
        else if (section === 'team') label = 'Team Member';
        else if (section === 'about-hero') label = 'Konten Hero';
        else if (section === 'activity-card') label = 'Activity Card';
        else if (section === 'podcast') label = 'Podcast Episode';
        else if (section === 'partner') label = 'Partner';
        else if (section === 'donation-settings') label = 'Pengaturan Donation';

        document.getElementById('modal-title').textContent = (isEdit ? 'Edit ' : 'Tambah ') + label;
        var html = '';

        if (section === 'donation-settings') {
            html += formField('Judul Hero', 'f-hero-title', item ? item.heroTitle : '', 'text', 'Contoh: Support Our Mission');
            html += formTextarea('Sub Hero', 'f-hero-sub', item ? item.heroSubtitle : '', 'Deskripsi...');
            html += formField('Teks di Gambar Strip', 'f-strip-text', item ? item.stripText : '', 'text', 'Together We Can');

            html += '<div class="mb-4"><label class="block text-sm font-semibold text-heading mb-1.5">Gambar Strip (Banner Tengah)</label><p class="text-[10px] text-gray-400 mb-2">Rekomendasi ukuran: 1200 x 400 px (Rasio 3:1)</p><div id="upload-zone" class="upload-zone rounded-xl p-4 text-center">';
            var existingStrip = '';
            if (item && item.stripImage) existingStrip = _resolveImgPath(item.stripImage);
            if (existingStrip) {
                html += '<div class="relative"><img src="' + escapeAttr(existingStrip) + '" class="w-full h-32 object-cover rounded-lg"><button type="button" onclick="removeUpload()" class="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-full"><i class="fas fa-times"></i></button></div>';
            } else {
                html += '<div class="py-4 text-center text-gray-400 text-sm">Klik untuk upload gambar strip</div>';
            }
            html += '</div></div>';

            html += '<hr class="my-4"><h4 class="font-bold text-heading mb-4">Payment Details</h4>';
            html += formField('Nama Bank', 'f-bank-name', item ? item.bankName : '', 'text', 'BCA');
            html += formField('Atas Nama', 'f-acc-name', item ? item.accountName : '', 'text', 'Yuni Triandini');
            html += formField('Nomor Rekening', 'f-acc-num', item ? item.accountNumber : '', 'text', '466...');

            html += '<div class="mb-4"><label class="block text-sm font-semibold text-heading mb-1.5">Gambar QRIS</label><p class="text-[10px] text-gray-400 mb-2">Rekomendasi ukuran: 500 x 500 px (Rasio 1:1, Square)</p><div id="upload-zone-qris" class="upload-zone rounded-xl p-4 text-center border border-dashed border-gray-300">';
            var existingQris = '';
            if (item && item.qrisImage) existingQris = _resolveImgPath(item.qrisImage);
            if (existingQris) {
                html += '<div class="relative"><img src="' + escapeAttr(existingQris) + '" class="w-24 h-24 object-contain mx-auto bg-gray-50 rounded"><button type="button" onclick="removeUploadQris()" class="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-xs">X</button></div>';
            } else {
                html += '<div class="py-4 text-center text-gray-400 text-sm border border-dashed border-gray-300 rounded">Upload QRIS</div>';
            }
            html += '</div></div>';
        }
        else if (section === 'about-hero') {
            html += formField('Judul (Support HTML)', 'f-title', item ? item.title : '', 'text', 'Judul besar...');
            html += formTextarea('Subtitle', 'f-subtitle', item ? item.subtitle : '', 'Deskripsi singkat...');
            html += formField('Label Relawan (Contoh: 1k+)', 'f-volunteer', item ? item.volunteerCount : '1k+', 'text', '1k+');

            html += '<div class="mb-4">' +
                '<label class="block text-sm font-semibold text-heading mb-1.5">Gambar Background Hero</label>' +
                '<p class="text-[10px] text-gray-400 mb-2">Rekomendasi ukuran: 1200 x 800 px atau 1920 x 1080 px (Rasio 3:2 atau 16:9)</p>' +
                '<div id="upload-zone" class="upload-zone rounded-xl p-4 text-center">';
            var existingHeroSrc = '';
            if (item && item.image) existingHeroSrc = _resolveImgPath(item.image);
            if (existingHeroSrc) {
                html += '<div class="relative"><img src="' + escapeAttr(existingHeroSrc) + '" class="w-full h-40 object-cover rounded-lg bg-gray-50"><button type="button" onclick="removeUpload()" class="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-full"><i class="fas fa-times"></i></button></div><p class="text-xs text-green-600 mt-2">Gambar Hero tersedia</p>';
            } else {
                html += '<div class="py-6 text-center"><i class="fas fa-image text-3xl text-gray-300 mb-2"></i><p class="text-sm text-gray-500">Klik untuk ganti gambar</p></div>';
            }
            html += '</div></div>';
        }
        else if (section === 'external' || section === 'internal') {
            html += formField('Nama', 'f-name', item ? item.name : '', 'text', 'Nama lengkap');
            if (section === 'external') html += formField('Jabatan / Title', 'f-title', item ? item.title : '', 'text', 'Co-Founder');
            else html += formField('Peran / Role', 'f-role', item ? item.role : '', 'text', 'Community Coordinator');
            html += formTextarea('Quote', 'f-quote', item ? item.quote : '', 'Kutipan...');

            var existingSrc = '';
            if (item && item.image) existingSrc = _resolveImgPath(item.image);
            html += '<div class="mb-4"><label class="block text-sm font-semibold text-heading mb-1.5">Foto</label><p class="text-[10px] text-gray-400 mb-2">Rekomendasi ukuran: 300 x 300 px (Rasio 1:1, Square)</p><div id="upload-zone" class="upload-zone rounded-xl p-4 text-center">';
            if (existingSrc) html += '<div class="relative"><img src="' + escapeAttr(existingSrc) + '" class="w-full h-40 object-contain rounded-lg bg-gray-50"><button type="button" onclick="removeUpload()" class="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-full"><i class="fas fa-times"></i></button></div><p class="text-xs text-green-600 mt-2">Gambar tersedia</p>';
            else html += '<div class="py-6 text-center"><i class="fas fa-cloud-upload-alt text-3xl text-gray-300 mb-2"></i><p class="text-sm text-gray-500">Upload Foto</p></div>';
            html += '</div></div>';
        }
        else if (section === 'faq') {
            html += formField('Pertanyaan', 'f-question', item ? item.question : '', 'text', 'Pertanyaan...');
            html += formTextarea('Jawaban', 'f-answer', item ? item.answer : '', 'Jawaban...');
        }
        else if (section === 'locations') {
            html += formField('Nama Lokasi', 'f-name', item ? item.name : '', 'text', 'Jakarta');

            html += '<div class="mb-4">' +
                '<label class="block text-sm font-semibold text-heading mb-1.5">Pilih Lokasi di Peta (Geser Pin)</label>' +
                '<div id="map-cms"></div>' +
                '<p class="text-[10px] text-gray-500 mt-1 italic"><i class="fas fa-info-circle mr-1"></i>Geser pin untuk menentukan koordinat secara otomatis.</p>' +
                '</div>';

            html += '<div class="grid grid-cols-2 gap-3">' +
                formField('Latitude', 'f-lat', item ? item.lat : '', 'number', '-6.2088', 'step="any" readonly class="bg-gray-50"') +
                formField('Longitude', 'f-lng', item ? item.lng : '', 'number', '106.8456', 'step="any" readonly class="bg-gray-50"') +
                '</div>';
            html += formField('Jumlah Relawan', 'f-volunteers', item ? item.volunteers : '', 'number', '1', 'min="1"');
        }
        else if (section === 'team') {
            html += formField('Nama', 'f-name', item ? item.name : '', 'text', 'Nama Lengkap');
            html += formField('Role', 'f-role', item ? item.role : '', 'text', 'Founder');
            html += formField('LinkedIn', 'f-linkedin', item ? item.linkedin : '', 'text', 'URL LinkedIn');
            html += formField('Instagram', 'f-instagram', item ? item.instagram : '', 'text', 'URL Instagram');

            var existingSrc = '';
            if (item && item.image) existingSrc = _resolveImgPath(item.image);
            html += '<div class="mb-4"><label class="block text-sm font-semibold text-heading mb-1.5">Foto Profil</label><p class="text-[10px] text-gray-400 mb-2">Rekomendasi ukuran: 400 x 400 px (Rasio 1:1, Square)</p><div id="upload-zone" class="upload-zone rounded-xl p-4 text-center">';
            if (existingSrc) html += '<div class="relative"><img src="' + escapeAttr(existingSrc) + '" class="w-full h-40 object-contain rounded-lg bg-gray-50"><button type="button" onclick="removeUpload()" class="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-full"><i class="fas fa-times"></i></button></div><p class="text-xs text-green-600 mt-2">Foto tersedia</p>';
            else html += '<div class="py-6 text-center"><i class="fas fa-cloud-upload-alt text-3xl text-gray-300 mb-2"></i><p class="text-sm text-gray-500">Upload Foto</p></div>';
            html += '</div></div>';
        }
        else if (section === 'activity-card') {
            html += formField('Judul Kegiatan', 'f-title', item ? item.title : '', 'text', 'Judul lengkap...');
            html += formField('Kategori', 'f-category', item ? item.category : '', 'text', 'Contoh: Education');
            html += formField('Tanggal', 'f-date', item ? item.date : '', 'text', '10 November 2025');
            html += formTextarea('Deskripsi Singkat (untuk Kartu)', 'f-desc', item ? item.description : '', 'Ringkasan...');

            html += '<div class="mb-4">' +
                '<label class="block text-sm font-semibold text-heading mb-1.5">Full Story (Detail Artikel)</label>' +
                '<p class="text-xs text-gray-400 mb-2">Anda bisa menggunakan tag HTML sederhana seperti &lt;p&gt;, &lt;br&gt;, &lt;b&gt;.</p>' +
                '<textarea id="f-full-story" rows="10" placeholder="Tulis cerita lengkap di sini..." class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all">' + escapeHtml(item ? (item.fullStory || '') : '') + '</textarea>' +
                '</div>';

            var existingSrc = '';
            if (item && item.image) existingSrc = _resolveImgPath(item.image);
            html += '<div class="mb-4"><label class="block text-sm font-semibold text-heading mb-1.5">Gambar Cover</label><p class="text-[10px] text-gray-400 mb-2">Rekomendasi ukuran: 800 x 500 px (Rasio 16:10 atau 4:3)</p><div id="upload-zone" class="upload-zone rounded-xl p-4 text-center">';
            if (existingSrc) html += '<div class="relative"><img src="' + escapeAttr(existingSrc) + '" class="w-full h-40 object-cover rounded-lg bg-gray-50"><button type="button" onclick="removeUpload()" class="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-full"><i class="fas fa-times"></i></button></div><p class="text-xs text-green-600 mt-2">Gambar tersedia</p>';
            else html += '<div class="py-6 text-center"><i class="fas fa-image text-3xl text-gray-300 mb-2"></i><p class="text-sm text-gray-500">Upload Gambar</p></div>';
            html += '</div></div>';
        }
        else if (section === 'podcast') {
            html += formField('Judul Episode', 'f-title', item ? item.title : '', 'text', 'Judul Podcast...');
            html += formField('Nomor Episode', 'f-episode', item ? item.episode : '', 'text', 'Episode 1');
            html += formField('Link Spotify', 'f-spotify-link', item ? item.spotifyLink : '', 'text', 'https://open.spotify.com/...');

            var existingThumb = '';
            if (item && item.thumbnail) existingThumb = _resolveImgPath(item.thumbnail);
            html += '<div class="mb-4"><label class="block text-sm font-semibold text-heading mb-1.5">Thumbnail Cover</label><p class="text-[10px] text-gray-400 mb-2">Rekomendasi ukuran: 500 x 500 px (Rasio 1:1, Square)</p><div id="upload-zone" class="upload-zone rounded-xl p-4 text-center">';
            if (existingThumb) {
                html += '<div class="relative"><img src="' + escapeAttr(existingThumb) + '" class="w-full h-40 object-cover rounded-lg bg-gray-50"><button type="button" onclick="removeUpload()" class="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-full"><i class="fas fa-times"></i></button></div><p class="text-xs text-green-600 mt-2">Thumbnail tersedia</p>';
            } else {
                html += '<div class="py-6 text-center"><i class="fas fa-image text-3xl text-gray-300 mb-2"></i><p class="text-sm text-gray-500">Upload Thumbnail</p></div>';
            }
            html += '</div></div>';
        }
        else if (section === 'partner') {
            html += formField('Nama Partner', 'f-name', item ? item.name : '', 'text', 'Contoh: Qatar HR Forum');
            html += formTextarea('Deskripsi Singkat', 'f-desc', item ? item.description : '', 'Deskripsi singkat...');

            html += '<div class="mb-4">' +
                '<label class="block text-sm font-semibold text-heading mb-1.5">Link Partner (URL)</label>' +
                '<div class="relative">' +
                '<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><i class="fas fa-link text-xs"></i></span>' +
                '<input type="url" id="f-link" value="' + (item ? (item.link || '#') : 'https://') + '" placeholder="https://website-partner.com" class="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:border-primary">' +
                '</div>' +
                '<p class="text-[10px] text-gray-400 mt-1">Masukkan URL lengkap (dengan https://)</p>' +
                '</div>';

            html += '<div class="mb-4">' +
                '<label class="block text-sm font-semibold text-heading mb-1.5">Pilih Icon</label>' +
                '<select id="f-icon" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:border-primary">' +
                '<option value="fa-handshake" ' + (item && item.icon === 'fa-handshake' ? 'selected' : '') + '>Handshake (Kerjasama)</option>' +
                '<option value="fa-users-cog" ' + (item && item.icon === 'fa-users-cog' ? 'selected' : '') + '>Users Cog (Komunitas)</option>' +
                '<option value="fa-spa" ' + (item && item.icon === 'fa-spa' ? 'selected' : '') + '>Spa (Kesehatan/Kecantikan)</option>' +
                '<option value="fa-flask" ' + (item && item.icon === 'fa-flask' ? 'selected' : '') + '>Flask (Sains/Lab)</option>' +
                '<option value="fa-school" ' + (item && item.icon === 'fa-school' ? 'selected' : '') + '>School (Pendidikan)</option>' +
                '<option value="fa-building" ' + (item && item.icon === 'fa-building' ? 'selected' : '') + '>Building (Korporat)</option>' +
                '<option value="fa-heart" ' + (item && item.icon === 'fa-heart' ? 'selected' : '') + '>Heart (Sosial)</option>' +
                '<option value="fa-globe" ' + (item && item.icon === 'fa-globe' ? 'selected' : '') + '>Globe (Global)</option>' +
                '<option value="fa-spotify" ' + (item && item.icon === 'fa-spotify' ? 'selected' : '') + '>Spotify (Musik/Podcast)</option>' +
                '</select>' +
                '</div>';

            html += '<div class="mb-4">' +
                '<label class="block text-sm font-semibold text-heading mb-1.5">Warna Latar</label>' +
                '<select id="f-color" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:border-primary">' +
                '<option value="blue" ' + (item && item.color === 'blue' ? 'selected' : '') + '>Biru</option>' +
                '<option value="pink" ' + (item && item.color === 'pink' ? 'selected' : '') + '>Pink</option>' +
                '<option value="purple" ' + (item && item.color === 'purple' ? 'selected' : '') + '>Ungu</option>' +
                '<option value="green" ' + (item && item.color === 'green' ? 'selected' : '') + '>Hijau</option>' +
                '<option value="yellow" ' + (item && item.color === 'yellow' ? 'selected' : '') + '>Kuning</option>' +
                '<option value="gray" ' + (item && item.color === 'gray' ? 'selected' : '') + '>Abu-abu</option>' +
                '</select>' +
                '</div>';

            var existingSrc = '';
            if (item && item.image) existingSrc = _resolveImgPath(item.image);
            html += '<div class="mb-4"><label class="block text-sm font-semibold text-heading mb-1.5">Logo Partner (Opsional)</label><p class="text-[10px] text-gray-400 mb-2">Rekomendasi ukuran: 400 x 200 px atau 300 x 300 px (PNG Transparan disukai). Jika diupload, akan menggantikan icon di atas.</p><div id="upload-zone" class="upload-zone rounded-xl p-4 text-center">';
            if (existingSrc) html += '<div class="relative"><img src="' + escapeAttr(existingSrc) + '" class="w-full h-40 object-contain rounded-lg bg-gray-50"><button type="button" onclick="removeUpload()" class="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-full"><i class="fas fa-times"></i></button></div><p class="text-xs text-green-600 mt-2">Logo tersedia</p>';
            else html += '<div class="py-6 text-center"><i class="fas fa-cloud-upload-alt text-3xl text-gray-300 mb-2"></i><p class="text-sm text-gray-500">Upload Logo</p></div>';
            html += '</div></div>';
        }

        html += '<div class="flex gap-3 mt-6 pt-4 border-t border-gray-100">' +
            '<button type="button" onclick="closeModal()" class="flex-1 py-2.5 border border-gray-200 text-heading font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm">Batal</button>' +
            '<button type="button" onclick="saveItem()" class="flex-1 py-2.5 bg-primary hover:bg-primaryDark text-white font-semibold rounded-lg transition-colors text-sm">' + (isEdit ? 'Simpan' : 'Tambah') + '</button>' +
            '</div>';

        document.getElementById('modal-body').innerHTML = html;

        if (section === 'donation-settings') {
            initDragDrop('strip');
            var qrisZone = document.getElementById('upload-zone-qris');
            if (qrisZone) {
                qrisZone.addEventListener('click', (function () { triggerUpload('qris'); }));
                qrisZone.addEventListener('dragover', function (e) {
                    e.preventDefault(); qrisZone.classList.add('dragover');
                });
                qrisZone.addEventListener('dragleave', function () { qrisZone.classList.remove('dragover'); });
                qrisZone.addEventListener('drop', function (e) {
                    e.preventDefault(); qrisZone.classList.remove('dragover');
                    var file = e.dataTransfer.files[0];
                    if (!file || !file.type.startsWith('image/')) return showToast('File harus gambar', 'error');
                    if (file.size > 10 * 1024 * 1024) return showToast('File terlalu besar', 'error');
                    qrisZone.innerHTML = '<div class="py-6 text-center text-gray-400"><i class="fas fa-spinner fa-spin text-2xl mb-2 block"></i><p class="text-xs">Memproses QRIS...</p></div>';
                    compressImage(file, 400, 0.7, function (base64) {
                        uploadedQrisImage = base64;
                        updateUploadPreviewQris(base64);
                    });
                });
            }
        } else if (section === 'external' || section === 'internal' || section === 'team' || section === 'about-hero' || section === 'activity-card' || section === 'podcast' || section === 'partner') {
            initDragDrop('main');
        } else if (section === 'locations') {
            initCmsMap(item);
        }
    }

    function formField(label, id, value, type, placeholder, extra) {
        return '<div class="mb-4">' +
            '<label class="block text-sm font-semibold text-heading mb-1.5">' + label + '</label>' +
            '<input type="' + type + '" id="' + id + '" value="' + escapeAttr(value) + '" placeholder="' + escapeAttr(placeholder) + '" ' + (extra || '') + ' class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all">' +
            '</div>';
    }

    function formTextarea(label, id, value, placeholder) {
        return '<div class="mb-4">' +
            '<label class="block text-sm font-semibold text-heading mb-1.5">' + label + '</label>' +
            '<textarea id="' + id + '" rows="3" placeholder="' + escapeAttr(placeholder) + '" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all">' + escapeHtml(value) + '</textarea>' +
            '</div>';
    }

    function openModal() {
        document.getElementById('modal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        setTimeout(function () {
            var firstInput = document.querySelector('#modal-body input, #modal-body textarea');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    window.closeModal = function () {
        document.getElementById('modal').classList.add('hidden');
        document.body.style.overflow = '';
        editingItem = null;
        editingSection = null;
        uploadedImage = null;
        uploadedQrisImage = null;
    };

    /* =========================================
       SAVE ITEM
       ========================================= */
    window.saveItem = function () {
        var section = editingSection;
        var data = getData();
        var isEdit = !!editingItem;
        var item = editingItem;

        if (section === 'about-hero') {
            if (!data.aboutHero) data.aboutHero = {};
            data.aboutHero.title = document.getElementById('f-title').value.trim();
            data.aboutHero.subtitle = document.getElementById('f-subtitle').value.trim();
            data.aboutHero.volunteerCount = document.getElementById('f-volunteer').value.trim();

            if (uploadedImage) {
                data.aboutHero.image = uploadedImage;
            } else if (isEdit) {
                if (editingItem && editingItem.image) data.aboutHero.image = editingItem.image;
            } else {
                if (window.HEY_YOUTH_DEFAULT_DATA.aboutHero && window.HEY_YOUTH_DEFAULT_DATA.aboutHero.image) data.aboutHero.image = window.HEY_YOUTH_DEFAULT_DATA.aboutHero.image;
            }

            if (!data.aboutHero.title) { showToast('Judul wajib diisi.', 'error'); return; }
        }
        else if (section === 'external' || section === 'internal') {
            var name = document.getElementById('f-name').value.trim();
            var quote = document.getElementById('f-quote').value.trim();
            if (!name || !quote) { showToast('Nama dan quote wajib diisi.', 'error'); return; }

            var image = '';
            if (uploadedImage) image = uploadedImage;
            else if (isEdit && editingItem.image && !editingItem.image.startsWith('data:')) image = editingItem.image;

            var obj = { id: isEdit ? editingItem.id : Date.now(), name: name, quote: quote, image: image };

            if (section === 'external') {
                if (!data.externalTestimonials) data.externalTestimonials = [];
            } else {
                if (!data.internalTestimonials) data.internalTestimonials = [];
            }
            var list = (section === 'external') ? data.externalTestimonials : data.internalTestimonials;

            if (section === 'external') obj.title = document.getElementById('f-title').value.trim() || '';
            else obj.role = document.getElementById('f-role').value.trim() || '';

            if (isEdit) {
                var idx = list.findIndex(function (i) { return i.id === editingItem.id; });
                if (idx !== -1) list[idx] = obj;
            } else {
                list.push(obj);
            }

        } else if (section === 'faq') {
            var question = document.getElementById('f-question').value.trim();
            var answer = document.getElementById('f-answer').value.trim();
            if (!question || !answer) { showToast('Pertanyaan dan jawaban wajib diisi.', 'error'); return; }

            var obj = { id: isEdit ? editingItem.id : Date.now(), question: question, answer: answer };

            if (!data.faqs) data.faqs = [];
            var list = data.faqs;
            if (isEdit) {
                var idx = list.findIndex(function (i) { return i.id === editingItem.id; });
                if (idx !== -1) list[idx] = obj;
            } else {
                list.push(obj);
            }

        } else if (section === 'locations') {
            var name = document.getElementById('f-name').value.trim();
            var lat = parseFloat(document.getElementById('f-lat').value);
            var lng = parseFloat(document.getElementById('f-lng').value);
            var volunteers = parseInt(document.getElementById('f-volunteers').value) || 1;
            if (!name || isNaN(lat) || isNaN(lng)) { showToast('Data lokasi tidak lengkap.', 'error'); return; }

            var obj = { id: isEdit ? editingItem.id : Date.now(), name: name, lat: lat, lng: lng, volunteers: volunteers };

            if (!data.locations) data.locations = [];
            var list = data.locations;
            if (isEdit) {
                var idx = list.findIndex(function (i) { return i.id === editingItem.id; });
                if (idx !== -1) list[idx] = obj;
            } else {
                list.push(obj);
            }
        }
        else if (section === 'team') {
            var name = document.getElementById('f-name').value.trim();
            var role = document.getElementById('f-role').value.trim();
            if (!name || !role) { showToast('Nama dan role wajib diisi.', 'error'); return; }

            var image = '';
            if (uploadedImage) image = uploadedImage;
            else if (isEdit && editingItem.image && !editingItem.image.startsWith('data:')) image = editingItem.image;

            var obj = {
                id: isEdit ? editingItem.id : Date.now(),
                name: name, role: role,
                linkedin: document.getElementById('f-linkedin').value.trim() || '#',
                instagram: document.getElementById('f-instagram').value.trim() || '#',
                image: image
            };

            if (!data.team) data.team = [];
            var list = data.team;
            if (isEdit) {
                var idx = list.findIndex(function (i) { return i.id === editingItem.id; });
                if (idx !== -1) list[idx] = obj;
            } else {
                list.push(obj);
            }
        }
        else if (section === 'activity-card') {
            var title = document.getElementById('f-title').value.trim();
            var category = document.getElementById('f-category').value.trim();
            if (!title) { showToast('Judul wajib diisi.', 'error'); return; }

            var image = '';
            if (uploadedImage) image = uploadedImage;
            else if (isEdit && editingItem.image && !editingItem.image.startsWith('data:')) image = editingItem.image;

            var fullStoryVal = document.getElementById('f-full-story').value;

            var obj = {
                id: isEdit ? editingItem.id : Date.now(),
                title: title,
                category: category,
                date: document.getElementById('f-date').value.trim(),
                description: document.getElementById('f-desc').value.trim(),
                image: image,
                link: '#',
                fullStory: fullStoryVal
            };

            if (!data.activityCards) data.activityCards = [];
            var list = data.activityCards;
            if (isEdit) {
                var idx = list.findIndex(function (i) { return i.id === editingItem.id; });
                if (idx !== -1) list[idx] = obj;
            } else {
                list.push(obj);
            }
        }
        else if (section === 'podcast') {
            var title = document.getElementById('f-title').value.trim();
            var episode = document.getElementById('f-episode').value.trim();
            var spotifyLink = document.getElementById('f-spotify-link').value.trim();

            if (!title) { showToast('Judul wajib diisi.', 'error'); return; }

            var image = '';
            if (uploadedImage) {
                image = uploadedImage;
            } else if (isEdit && editingItem.thumbnail && !editingItem.thumbnail.startsWith('data:')) {
                image = editingItem.thumbnail;
            }

            var obj = {
                id: isEdit ? editingItem.id : Date.now(),
                episode: episode,
                title: title,
                thumbnail: image,
                spotifyLink: spotifyLink || '#'
            };

            if (!data.podcasts) data.podcasts = [];
            var list = data.podcasts;
            if (isEdit) {
                var idx = list.findIndex(function (i) { return i.id === editingItem.id; });
                if (idx !== -1) list[idx] = obj;
            } else {
                list.push(obj);
            }
        }
        else if (section === 'partner') {
            var name = document.getElementById('f-name').value.trim();
            var description = document.getElementById('f-desc').value.trim();
            if (!name) { showToast('Nama partner wajib diisi.', 'error'); return; }

            var image = '';
            if (uploadedImage) image = uploadedImage;
            else if (isEdit && editingItem.image && !editingItem.image.startsWith('data:')) image = editingItem.image;

            var obj = {
                id: isEdit ? editingItem.id : Date.now(),
                name: name,
                description: description,
                icon: document.getElementById('f-icon').value,
                color: document.getElementById('f-color').value,
                image: image,
                link: document.getElementById('f-link').value.trim() || '#'
            };

            if (!data.partners) data.partners = [];
            var list = data.partners;
            if (isEdit) {
                var idx = list.findIndex(function (i) { return i.id === editingItem.id; });
                if (idx !== -1) list[idx] = obj;
            } else {
                list.push(obj);
            }
        }
        else if (section === 'donation-settings') {
            if (!data.donationSettings) data.donationSettings = {};
            data.donationSettings.heroTitle = document.getElementById('f-hero-title').value.trim();
            data.donationSettings.heroSubtitle = document.getElementById('f-hero-sub').value.trim();
            data.donationSettings.stripText = document.getElementById('f-strip-text').value.trim();

            if (uploadedImage) {
                data.donationSettings.stripImage = uploadedImage;
            } else if (isEdit) {
                if (item && item.stripImage && !item.stripImage.startsWith('data:')) {
                    data.donationSettings.stripImage = item.stripImage;
                }
            }

            data.donationSettings.bankName = document.getElementById('f-bank-name').value.trim();
            data.donationSettings.accountName = document.getElementById('f-acc-name').value.trim();
            data.donationSettings.accountNumber = document.getElementById('f-acc-num').value.trim();

            if (uploadedQrisImage) {
                data.donationSettings.qrisImage = uploadedQrisImage;
            } else if (isEdit) {
                if (item && item.qrisImage && !item.qrisImage.startsWith('data:')) {
                    data.donationSettings.qrisImage = item.qrisImage;
                }
            }
        }

        if (!saveData(data)) return;
        closeModal();
        renderAllLists();
        if (section === 'about-hero') renderAboutPreview();
        if (section === 'donation-settings') renderDonationPreview();
        showToast(isEdit ? 'Data berhasil diperbarui.' : 'Data berhasil ditambahkan.', 'success');
    };

    /* =========================================
       DELETE
       ========================================= */
    window.confirmDelete = function (section, id) {
        deletingSection = section;
        deletingId = id;
        document.getElementById('confirm-dialog').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        document.getElementById('confirm-delete-btn').onclick = function () { executeDelete(); };
    };

    window.closeConfirm = function () {
        document.getElementById('confirm-dialog').classList.add('hidden');
        document.body.style.overflow = '';
        deletingSection = null;
        deletingId = null;
    };

    function executeDelete() {
        var data = getData();
        var section = deletingSection;
        var id = deletingId;
        switch (section) {
            case 'external': data.externalTestimonials = (data.externalTestimonials || []).filter(function (i) { return i.id !== id; }); break;
            case 'internal': data.internalTestimonials = (data.internalTestimonials || []).filter(function (i) { return i.id !== id; }); break;
            case 'faq': data.faqs = (data.faqs || []).filter(function (i) { return i.id !== id; }); break;
            case 'locations': data.locations = (data.locations || []).filter(function (i) { return i.id !== id; }); break;
            case 'team': data.team = (data.team || []).filter(function (i) { return i.id !== id; }); break;
            case 'activity-card': data.activityCards = (data.activityCards || []).filter(function (i) { return i.id !== id; }); break;
            case 'podcast': data.podcasts = (data.podcasts || []).filter(function (i) { return i.id !== id; }); break;
            case 'partner': data.partners = (data.partners || []).filter(function (i) { return i.id !== id; }); break;
        }
        if (!saveData(data)) return;
        closeConfirm();
        renderAllLists();
        showToast('Data berhasil dihapus.', 'success');
    }

    window.resetData = async function () {
        if (!confirm('Reset semua data ke default?')) return;
        memoryData = JSON.parse(JSON.stringify(window.HEY_YOUTH_DEFAULT_DATA));
        await window.saveFirebaseData(memoryData);
        renderAllLists();
        renderAboutPreview();
        renderDonationPreview();
        showToast('Data berhasil direset.', 'success');
    };

    window.logout = function () {
        firebase.auth().signOut().then(function () {
            window.location.href = 'Login.html';
        }).catch(function (error) {
            console.error("Logout error", error);
        });
    };

    /* =========================================
       TOAST
       ========================================= */
    var toastTimer = null;
    function showToast(message, type) {
        var toast = document.getElementById('toast');
        var inner = document.getElementById('toast-inner');
        var icon = document.getElementById('toast-icon');
        var text = document.getElementById('toast-text');
        if (toastTimer) clearTimeout(toastTimer);
        text.textContent = message;
        if (type === 'success') {
            inner.className = 'flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium bg-green-600 text-white toast-enter';
            icon.className = 'fas fa-check-circle';
        } else {
            inner.className = 'flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium bg-red-500 text-white toast-enter';
            icon.className = 'fas fa-exclamation-circle';
        }
        toast.classList.remove('hidden');
        toastTimer = setTimeout(function () {
            inner.classList.remove('toast-enter');
            inner.classList.add('toast-exit');
            setTimeout(function () {
                toast.classList.add('hidden');
                inner.classList.remove('toast-exit');
            }, 300);
        }, 3000);
    }

    function escapeHtml(str) {
        if (!str) return '';
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function escapeAttr(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (!document.getElementById('confirm-dialog').classList.contains('hidden')) { closeConfirm(); }
            else if (!document.getElementById('modal').classList.contains('hidden')) { closeModal(); }
        }
    });

    /* =========================================
       STATISTICS
       ========================================= */
    var visitorChartInstance = null;
    var unsubscribeVisitorStats = null;
    var lastStatsData = null;

    function generateMockStatistics() {
        var pages = {
            'Home': 542,
            'About Us': 214,
            'Activities': 324,
            'Partners': 125,
            'Donation': 89,
            'Gallery': 56
        };
        var daily = {};
        var total = 0;
        var keys = Object.keys(pages);
        for (var k = 0; k < keys.length; k++) {
            total += pages[keys[k]];
        }

        var now = new Date();
        for (var i = 6; i >= 0; i--) {
            var date = new Date(now);
            date.setDate(now.getDate() - i);
            var dateStr = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
            daily[dateStr] = Math.floor(Math.random() * 90) + 30;
        }

        return {
            total: total,
            pages: pages,
            daily: daily
        };
    }

    function renderVisitorChart(dailyData) {
        var ctx = document.getElementById('visitorChart').getContext('2d');
        var labels = [];
        var data = [];
        var now = new Date();

        for (var i = 6; i >= 0; i--) {
            var date = new Date(now);
            date.setDate(now.getDate() - i);
            var dateStr = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');

            var dayLabel = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
            labels.push(dayLabel);
            data.push(dailyData[dateStr] || 0);
        }

        if (visitorChartInstance) {
            visitorChartInstance.destroy();
        }

        visitorChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Pengunjung Harian',
                    data: data,
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.05)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3B82F6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1E293B',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: false
                    }
                },
                scales: {
                    y: {
                        grid: {
                            color: 'rgba(241, 245, 249, 1)'
                        },
                        ticks: {
                            font: {
                                family: 'Inter',
                                size: 11
                            },
                            color: '#64748B',
                            precision: 0
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: 'Inter',
                                size: 11
                            },
                            color: '#64748B'
                        }
                    }
                }
            }
        });
    }

    function updateStatisticsUI(stats) {
        if (!stats) return;
        document.getElementById('stat-total-visitors').textContent = stats.total || 0;

        var now = new Date();
        var todayStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
        document.getElementById('stat-today-visitors').textContent = (stats.daily && stats.daily[todayStr]) ? stats.daily[todayStr] : 0;

        var tbody = document.getElementById('stat-page-views-tbody');
        var pages = stats.pages || {};

        var pageList = Object.keys(pages).map(function (p) {
            return { name: p, views: pages[p] };
        }).sort(function (a, b) {
            return b.views - a.views;
        });

        if (pageList.length > 0) {
            document.getElementById('stat-top-page').textContent = pageList[0].name;
        } else {
            document.getElementById('stat-top-page').textContent = '-';
        }

        var totalPageViews = 0;
        for (var j = 0; j < pageList.length; j++) {
            totalPageViews += pageList[j].views;
        }
        if (totalPageViews === 0) totalPageViews = 1;

        if (pageList.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center py-6 text-gray-400">Belum ada data kunjungan.</td></tr>';
        } else {
            tbody.innerHTML = pageList.map(function (p) {
                var pct = Math.round((p.views / totalPageViews) * 100);
                var colorClass = '';
                if (pct < 50) {
                    colorClass = 'text-green-600 font-semibold';
                } else if (pct >= 50 && pct <= 80) {
                    colorClass = 'text-yellow-500 font-semibold';
                } else {
                    colorClass = 'text-red-600 font-semibold';
                }

                var activePages = ['Home', 'About Us', 'Activities', 'Partners', 'Donation', 'Gallery'];
                var isActive = activePages.indexOf(p.name) !== -1;
                var statusBadge = isActive
                    ? '<span class="bg-green-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm">Active</span>'
                    : '<span class="bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm">Inactive</span>';

                return '<tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">' +
                    '<td class="px-3 py-2.5 font-medium text-heading text-xs">' + escapeHtml(p.name) + '</td>' +
                    '<td class="px-3 py-2.5 text-center">' + statusBadge + '</td>' +
                    '<td class="px-3 py-2.5 text-right font-semibold text-xs">' + p.views + '</td>' +
                    '<td class="px-3 py-2.5 text-right text-xs ' + colorClass + '">' + pct + '%</td>' +
                    '</tr>';
            }).join('');
        }

        var homepageView = document.getElementById('view-homepage');
        if (homepageView && !homepageView.classList.contains('hidden')) {
            renderVisitorChart(stats.daily || {});
        }
    }

    function initStatisticsListener() {
        if (unsubscribeVisitorStats) return;

        var docRef = db.collection('heyyouth').doc('visitor_stats');
        unsubscribeVisitorStats = docRef.onSnapshot(async function (docSnap) {
            var stats = null;
            if (docSnap.exists) {
                stats = docSnap.data();
            } else {
                stats = generateMockStatistics();
                await docRef.set(stats);
            }
            lastStatsData = stats;
            updateStatisticsUI(stats);
        }, function (error) {
            console.error("Error loading statistics: ", error);
            showToast("Gagal memuat statistik pengunjung real-time", "error");
        });
    }

    function initThemeToggle() {
        var toggles = document.querySelectorAll('.theme-toggle-btn');
        if (!toggles.length) return;

        var currentTheme = localStorage.getItem('heyyouth_theme') || 'light';

        function setTheme(theme) {
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            localStorage.setItem('heyyouth_theme', theme);

            toggles.forEach(function (btn) {
                var iconSun = btn.querySelector('.theme-icon-sun');
                var iconMoon = btn.querySelector('.theme-icon-moon');
                if (iconSun && iconMoon) {
                    if (theme === 'dark') {
                        iconSun.classList.remove('hidden');
                        iconMoon.classList.add('hidden');
                    } else {
                        iconSun.classList.add('hidden');
                        iconMoon.classList.remove('hidden');
                    }
                }
            });
        }

        setTheme(currentTheme);

        toggles.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var theme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
                setTheme(theme);
            });
        });
    }

    async function initDashboard() {
        var data = await window.getFirebaseData(window.HEY_YOUTH_DEFAULT_DATA);
        memoryData = data;
        renderAllLists();
        initStatisticsListener();
        initThemeToggle();
    }
})();
