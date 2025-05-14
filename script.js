// [Существующий код до setupIndexPage остается без изменений]

function setupIndexPage() {
    const homeBox = document.getElementById('home-box');
    if (homeBox) {
        homeBox.addEventListener('mousemove', (e) => {
            const rect = homeBox.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            const rotateX = (mouseY / rect.height) * 20;
            const rotateY = -(mouseX / rect.width) * 20;
            gsap.to(homeBox, {
                rotationX: rotateX,
                rotationY: rotateY,
                rotationZ: (mouseX / rect.width) * 5,
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        homeBox.addEventListener('mouseleave', () => {
            gsap.to(homeBox, {
                rotationX: 0,
                rotationY: 0,
                rotationZ: 0,
                scale: 1,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    }

    let viewMode = localStorage.getItem('viewMode') || 'grid';
    const searchInput = document.getElementById('search-input');
    const gridViewBtn = document.getElementById('grid-view-btn');
    const listViewBtn = document.getElementById('list-view-btn');
    const trendingGrid = document.getElementById('trending-grid');

    console.log('SetupIndexPage started:', { searchInput, gridViewBtn, listViewBtn, trendingGrid });

    function renderTracks() {
        if (!trendingGrid) {
            console.error('trendingGrid not found!');
            return;
        }
        console.log('Rendering tracks, filteredTracks length:', filteredTracks.length);
        trendingGrid.innerHTML = '';
        filteredTracks.forEach(song => {
            const card = document.createElement('div');
            if (viewMode === 'grid') {
                card.className = 'song-card rounded-xl p-4 text-center';
                card.innerHTML = `
                    <img src="${song.cover}" alt="${song.title}" class="w-full h-48 object-cover rounded-lg mb-4">
                    <h3 class="song-title text-lg text-white font-semibold mb-2">${song.title}</h3>
                    <p class="text-gray-400 mb-2">${song.artist}</p>
                    <p class="text-gray-500 text-sm">${song.duration} • ${song.genre}</p>
                `;
            } else {
                card.className = 'song-row song-card bg-opacity-50';
                card.innerHTML = `
                    <img src="${song.cover}" alt="${song.title}">
                    <div>
                        <h3 class="song-title text-lg text-white font-semibold">${song.title}</h3>
                        <p class="text-gray-400">${song.artist}</p>
                        <p class="text-gray-500 text-sm">${song.duration} • ${song.genre}</p>
                    </div>
                `;
            }
            card.addEventListener('click', () => playSong(song));
            trendingGrid.appendChild(card);
        });

        trendingGrid.className = viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 items-start'
            : 'grid grid-cols-1 gap-0';
        updatePlayingTrack();
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            filteredTracks = tracks.filter(song =>
                song.title.toLowerCase().includes(query) ||
                song.artist.toLowerCase().includes(query) ||
                song.genre.toLowerCase().includes(query)
            );
            renderTracks();
        });
    }

    if (gridViewBtn) {
        gridViewBtn.addEventListener('click', () => {
            viewMode = 'grid';
            localStorage.setItem('viewMode', viewMode);
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            renderTracks();
        });
    }

    if (listViewBtn) {
        listViewBtn.addEventListener('click', () => {
            viewMode = 'list';
            localStorage.setItem('viewMode', viewMode);
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            renderTracks();
        });
    }

    if (viewMode === 'grid' && gridViewBtn) {
        gridViewBtn.classList.add('active');
    } else if (listViewBtn) {
        listViewBtn.classList.add('active');
    }

    renderTracks(); // Убедимся, что рендеринг вызывается
    renderSponsors();
    renderThemes(savedTheme);
}

// [Остальной код остается без изменений]