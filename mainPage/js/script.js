document.addEventListener('DOMContentLoaded', () => {
    
    // Slider yapılandırması ve DOM referansları
    const track = document.getElementById('sliderTrack');
    const slides = Array.from(track.children);
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    
    // İlerleme göstergesi öğeleri (Tır ve Dorse ikonları)
    const vehicleParts = document.querySelectorAll('.vehicle-part');

    const slideDuration = 500;
    const autoPlayDelay = 3000;
    let autoPlayInterval; 

    // Kusursuz döngü (infinite loop) için ilk ve son slaytların klonlanması
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    firstClone.id = 'first-clone';
    lastClone.id = 'last-clone';
    
    track.appendChild(firstClone);
    track.insertBefore(lastClone, slides[0]);

    const allSlides = document.querySelectorAll('.slide');
    let index = 1; // Aktif slayt indeksi
    track.style.transform = `translateX(${-100 * index}%)`;

    // İlerleme göstergesinin senkronizasyonu
    const updateProgress = (currentIndex) => {
        // Klonlanmış slaytları filtreleyerek gerçek slayt indeksini hesapla
        let step = currentIndex;
        if (currentIndex === allSlides.length - 1) step = 1; 
        if (currentIndex === 0) step = allSlides.length - 2; 

        // Gösterge öğelerinin aktif durumlarını sıfırla
        vehicleParts.forEach(part => part.classList.remove('active'));

        // Geçerli slayta karşılık gelen gösterge öğesini aktifleştir
        if (vehicleParts[step - 1]) {
            vehicleParts[step - 1].classList.add('active');
        }
    };

    // Slayt geçiş animasyonunu uygula
    const moveToSlide = () => {
        track.style.transition = `transform ${slideDuration}ms ease-in-out`;
        track.style.transform = `translateX(${-100 * index}%)`;
    };

    // Animasyon bitiminde sonsuz döngü sınır kontrolleri
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

    // Manuel kontrol butonları olay dinleyicileri
    nextBtn.addEventListener('click', () => { slideNext(); resetTimer(); });
    prevBtn.addEventListener('click', () => { slidePrev(); resetTimer(); });

    // Otomatik geçiş zamanlayıcısı yönetimi
    const startTimer = () => { autoPlayInterval = setInterval(slideNext, autoPlayDelay); };
    const resetTimer = () => { clearInterval(autoPlayInterval); startTimer(); };

    // Başlangıç durumunu ayarla ve zamanlayıcıyı başlat
    updateProgress(index);
    startTimer();

    // URL parametrelerine göre sayfa içi yönlendirme mantığı
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