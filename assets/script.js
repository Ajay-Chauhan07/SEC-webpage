       // Initialize AOS animation after page load
       document.addEventListener('DOMContentLoaded', function() {
        // Load AOS dynamically
        const aosScript = document.createElement('script');
        aosScript.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js';
        aosScript.onload = function() {
            AOS.init({
                duration: 600,
                easing: 'ease-out-quad',
                once: true
            });
        };
        document.head.appendChild(aosScript);

        // Mobile menu toggle
        const menuBtn = document.getElementById('menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (menuBtn && mobileMenu) {
            menuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // Class tabs functionality
        const tabButtons = document.querySelectorAll('.class-tab-btn');
        const tabContents = document.querySelectorAll('.class-tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => {
                    btn.classList.remove('active', 'bg-primary', 'text-white');
                    btn.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
                });
                
                tabContents.forEach(content => content.classList.add('hidden'));
                
                // Add active class to clicked button
                button.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
                button.classList.add('active', 'bg-primary', 'text-white');
                
                // Show corresponding content
                const targetClass = button.getAttribute('data-class');
                const targetContent = document.getElementById(`${targetClass}-classes`);
                if (targetContent) targetContent.classList.remove('hidden');
            });
        });

        // Gallery lightbox - load only when needed
        let lightboxInitialized = false;
        
        function initLightbox() {
            if (lightboxInitialized) return;
            lightboxInitialized = true;
            
            const galleryItems = document.querySelectorAll('.gallery-item');
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            const lightboxCaption = document.getElementById('lightbox-caption');
            const closeLightbox = document.getElementById('close-lightbox');
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            
            let currentImageIndex = 0;
            const images = Array.from(galleryItems).map(item => ({
                src: item.querySelector('img').src,
                caption: item.querySelector('h3').textContent
            }));
            
            function updateLightboxImage() {
                lightboxImg.src = images[currentImageIndex].src;
                lightboxCaption.textContent = images[currentImageIndex].caption;
            }
            
            galleryItems.forEach((item, index) => {
                item.addEventListener('click', () => {
                    currentImageIndex = index;
                    updateLightboxImage();
                    lightbox.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                });
            });
            
            if (closeLightbox) {
                closeLightbox.addEventListener('click', () => {
                    lightbox.classList.add('hidden');
                    document.body.style.overflow = '';
                });
            }
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
                    updateLightboxImage();
                });
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    currentImageIndex = (currentImageIndex + 1) % images.length;
                    updateLightboxImage();
                });
            }
            
            if (lightbox) {
                lightbox.addEventListener('click', (e) => {
                    if (e.target === lightbox) {
                        lightbox.classList.add('hidden');
                        document.body.style.overflow = '';
                    }
                });
            }
        }

        // Initialize lightbox only when a gallery item is clicked
        document.addEventListener('click', function(e) {
            if (e.target.closest('.gallery-item')) {
                initLightbox();
            }
        });

        // Scroll to top button with debounce
        const scrollTopBtn = document.getElementById('scroll-top');
        let scrollTimeout;
        
        function handleScroll() {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            
            scrollTimeout = window.requestAnimationFrame(function() {
                if (window.pageYOffset > 300) {
                    scrollTopBtn.classList.remove('opacity-0', 'invisible');
                    scrollTopBtn.classList.add('opacity-100', 'visible');
                } else {
                    scrollTopBtn.classList.remove('opacity-100', 'visible');
                    scrollTopBtn.classList.add('opacity-0', 'invisible');
                }
            });
        }
        
        if (scrollTopBtn) {
            window.addEventListener('scroll', handleScroll);
            
            scrollTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // Simple testimonial slider without jQuery
        let currentTestimonial = 0;
        const testimonials = document.querySelectorAll('.testimonial-card');
        const dotsContainer = document.querySelector('.slick-dots');
        
        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                testimonial.style.display = i === index ? 'block' : 'none';
            });
            
            // Update dots
            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll('li');
                dots.forEach((dot, i) => {
                    dot.classList.toggle('slick-active', i === index);
                });
            }
        }
        
        if (testimonials.length > 0) {
            // Create dots if they don't exist
            if (!dotsContainer) {
                const newDotsContainer = document.createElement('ul');
                newDotsContainer.className = 'slick-dots flex justify-center mt-4';
                
                testimonials.forEach((_, i) => {
                    const dot = document.createElement('li');
                    dot.className = `mx-1 cursor-pointer ${i === 0 ? 'slick-active' : ''}`;
                    dot.innerHTML = '<button class="w-3 h-3 rounded-full bg-gray-300 hover:bg-primary focus:outline-none"></button>';
                    dot.addEventListener('click', () => {
                        currentTestimonial = i;
                        showTestimonial(currentTestimonial);
                    });
                    newDotsContainer.appendChild(dot);
                });
                
                document.querySelector('.testimonial-slider').appendChild(newDotsContainer);
            }
            
            // Auto-rotate testimonials
            setInterval(() => {
                currentTestimonial = (currentTestimonial + 1) % testimonials.length;
                showTestimonial(currentTestimonial);
            }, 5000);
            
            // Show first testimonial initially
            showTestimonial(0);
        }

        // Form submission
        const contactForm = document.getElementById('contact-form');
        const formSuccess = document.getElementById('form-success');
        
        if (contactForm && formSuccess) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Here you would typically send the form data to your server
                // For demo purposes, we'll just show the success message
                formSuccess.classList.remove('hidden');
                contactForm.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    formSuccess.classList.add('hidden');
                }, 5000);
            });
        }

        // Payment button functionality (demo)
        const paymentButtons = document.querySelectorAll('.payment-btn');
        
        paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const amount = button.getAttribute('data-amount');
                const description = button.getAttribute('data-description');
                
                // In a real implementation, this would open Razorpay or other payment gateway
                alert(`In a real implementation, this would process payment of ₹${amount/100} for ${description}. You would be redirected to a secure payment page.`);
            });
        });

        // Hide preloader when everything is loaded
        window.addEventListener('load', () => {
            const preloader = document.querySelector('.preloader');
            if (preloader) {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }
        });
    });

    // Load Font Awesome dynamically
    const faScript = document.createElement('script');
    faScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js';
    document.head.appendChild(faScript);