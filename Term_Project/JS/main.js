const slider = document.getElementById('slider');
  const totalSlides = 3; // 악곡 갯수
  let currentIndex = -1; // 2번 버튼이 처음 중앙에

  //악곡 넘기기
  function updateSlide() {
    const slideWidth = window.innerWidth * 0.8;
    const margin = window.innerWidth * 0.1;
    const totalSlideWidth = slideWidth + 2 * margin;
    const offset = currentIndex * totalSlideWidth;
    const center = (window.innerWidth - totalSlideWidth) / 2;
    slider.style.transform = `translateX(${-offset + center}px)`;
  }

  //키보드 입력 좌, 우
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentIndex >= 0) {
      currentIndex--;
      updateSlide();
    } else if (e.key === 'ArrowRight' && currentIndex <= totalSlides-3) {
      currentIndex++;
      updateSlide();
    }
  });

  window.addEventListener('resize', updateSlide);
  updateSlide();