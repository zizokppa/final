// 通用的图片切换逻辑
function setupImageCycler(images, targetElement, isBackground = false, interval = 1000) {
    let currentIndex = 0;

    if (isBackground) {
        document.body.style.backgroundImage = `url(${images[currentIndex]})`;
    } else if (targetElement) {
        targetElement.src = images[currentIndex];
    }

    function changeImage() {
        currentIndex = (currentIndex + 1) % images.length;
        if (isBackground) {
            document.body.style.backgroundImage = `url(${images[currentIndex]})`;
        } else if (targetElement) {
            targetElement.src = images[currentIndex];
        }
    }

    let intervalId = null;
    if (isBackground) {
        intervalId = setInterval(changeImage, interval);
    }

    if (targetElement) {
        targetElement.addEventListener('click', () => {
            changeImage();
            if (isBackground && intervalId) {
                clearInterval(intervalId); // 停止背景切换
            }
        });
    }

    return intervalId;
}

// 页面初始化逻辑
document.addEventListener('DOMContentLoaded', () => {
    const pageTitle = document.title;

    // 加载 JSON 数据
    fetch('class.json')
        .then(response => response.json())
        .then(data => {
            const pages = data.pages;

            if (pageTitle === pages.index.title) {
                // Index 页面逻辑
                setupImageCycler(pages.index.images, null, true, 1000);
                document.body.addEventListener('click', () => {
                    window.location.href = pages.index.redirect;
                });
            }

            if (pageTitle === pages.documentation.title) {
                // Documentation 页面逻辑
                const photoElement = document.getElementById('photo');
                setupImageCycler(pages.documentation.images, photoElement);
            }

            if (pageTitle === pages.finalVideo.title) {
                // Final Video 页面逻辑
                const iframe = document.querySelector('iframe');
                iframe.src = pages.finalVideo.videoUrl;
            }

            if (pageTitle === pages.homepage.title) {
                // Homepage 页面逻辑
                const container = document.querySelector('.vertical-text');
                pages.homepage.links.forEach(link => {
                    const a = document.createElement('a');
                    a.href = link.href;
                    a.textContent = link.name;
                    container.appendChild(a);
                });
            }

            if (pageTitle === pages.concept.title) {
                // Concept 页面逻辑
                const contentContainer = document.querySelector('.content');
                pages.concept.poemSections.forEach(section => {
                    const sectionDiv = document.createElement('div');
                    sectionDiv.className = 'poem';
                    section.forEach(line => {
                        const p = document.createElement('p');
                        p.textContent = line;
                        sectionDiv.appendChild(p);
                    });
                    contentContainer.appendChild(sectionDiv);
                });
            }
        });
});
