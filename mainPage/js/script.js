document.addEventListener('DOMContentLoaded', () => {
    
    // --- SLIDER AYARLARI ---
    const track = document.getElementById('sliderTrack');
    const slides = Array.from(track.children);
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    
    // Gösterge Parçaları (Tır, Dorse 1, Dorse 2)
    const vehicleParts = document.querySelectorAll('.vehicle-part');

    const slideDuration = 500;
    const autoPlayDelay = 3000;
    let autoPlayInterval; 

    // Sonsuz döngü için klonlama
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    firstClone.id = 'first-clone';
    lastClone.id = 'last-clone';
    
    track.appendChild(firstClone);
    track.insertBefore(lastClone, slides[0]);

    const allSlides = document.querySelectorAll('.slide');
    let index = 1; // Başlangıç slaydı
    track.style.transform = `translateX(${-100 * index}%)`;

    // --- GÖSTERGE GÜNCELLEME ---
    const updateProgress = (currentIndex) => {
        // İndeks hesabı (Klonları yoksayarak 1, 2, 3'e çevir)
        let step = currentIndex;
        if (currentIndex === allSlides.length - 1) step = 1; 
        if (currentIndex === 0) step = allSlides.length - 2; 

        // Tüm ışıkları söndür
        vehicleParts.forEach(part => part.classList.remove('active'));

        // O anki parçayı yak (0: Tır, 1: 1.Dorse, 2: 2.Dorse)
        if (vehicleParts[step - 1]) {
            vehicleParts[step - 1].classList.add('active');
        }
    };

    // Kaydırma İşlemi
    const moveToSlide = () => {
        track.style.transition = `transform ${slideDuration}ms ease-in-out`;
        track.style.transform = `translateX(${-100 * index}%)`;
    };

    // Geçiş Bittiğinde (Loop Kontrolü)
    track.addEventListener('transitionend', () => {
        if (allSlides[index].id === 'first-clone') {
            track.style.transition = 'none';
            index = 1;
            track.style.transform = `translateX(${-100 * index}%)`;
        }
        if (allSlides[index].id === 'last-clone') {
            track.style.transition = 'none';
            index = allSlides.length - 2;
            track.style.transform = `translateX(${-100 * index}%)`;
        }
        updateProgress(index);
    });

    const slideNext = () => {
        if (index >= allSlides.length - 1) return;
        index++;
        moveToSlide();
    };

    const slidePrev = () => {
        if (index <= 0) return;
        index--;
        moveToSlide();
    };

    // Butonlar
    nextBtn.addEventListener('click', () => { slideNext(); resetTimer(); });
    prevBtn.addEventListener('click', () => { slidePrev(); resetTimer(); });

    // Otomatik Oynatma
    const startTimer = () => { autoPlayInterval = setInterval(slideNext, autoPlayDelay); };
    const resetTimer = () => { clearInterval(autoPlayInterval); startTimer(); };

    // Başlat
    updateProgress(index);
    startTimer();

    // --- SAYFA GEÇİŞ PARAMETRELERİ ---
    const urlParams = new URLSearchParams(window.location.search);
    const secim = urlParams.get('secim');
    if (secim) {
        const kayitLink = document.querySelector('.bottom-text a');
        if (kayitLink && kayitLink.getAttribute('href').includes('register.html')) {
             kayitLink.href = "register.html?secim=" + secim;
        }
        const selectKutusu = document.querySelector('select');
        if (selectKutusu) { selectKutusu.value = secim; }
    }
});