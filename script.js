(function () {
  "use strict";

  var DISCORD_ID = "1141849395902554202";
  var LANYARD_URL = "https://api.lanyard.rest/v1/users/" + DISCORD_ID;
  var LANYARD_WS = "wss://api.lanyard.rest/socket";

  var loader = document.getElementById("loader");
  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("nav-toggle");
  var mobileMenu = document.getElementById("mobile-menu");
  var canvas = document.getElementById("bg-canvas");
  var ctx = canvas.getContext("2d");
  var cursorDot = document.getElementById("cursor-dot");
  var scrollProgress = document.getElementById("scroll-progress");
  var cmdOverlay = document.getElementById("cmd-overlay");
  var cmdInput = document.getElementById("cmd-input");
  var cmdList = document.getElementById("cmd-list");
  var cmdTrigger = document.getElementById("cmd-trigger");
  var cmdBackdrop = document.getElementById("cmd-backdrop");
  var ctxMenu = document.getElementById("ctx-menu");
  var ctxVisible = false;

  document.body.classList.add("loading");

  var loaderDone = false;
  var spotifyInterval = null;

  function dismissLoader() {
    if (loaderDone) return;
    loaderDone = true;
    loader.classList.add("hidden");
    document.body.classList.remove("loading");
    nav.classList.add("visible");
    triggerHeroReveal();
  }

  setTimeout(dismissLoader, 1850);

  function triggerHeroReveal() {
    var heroEls = document.querySelectorAll(".reveal-hero");
    heroEls.forEach(function (el) {
      el.classList.add("active");
    });

    setTimeout(initScrollReveal, 600);
  }

  var mouseX = -100;
  var mouseY = -100;
  var dotX = -100;
  var dotY = -100;

  document.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener("mouseleave", function () {
    mouseX = -100;
    mouseY = -100;
  });

  var hoverTargets = "a, button, .skill-card, .project-card, .service-card, .setup-card, .cmd-item";

  document.addEventListener("mouseover", function (e) {
    if (e.target.closest(hoverTargets)) {
      cursorDot.classList.add("cursor-hover");
    }
  });

  document.addEventListener("mouseout", function (e) {
    if (e.target.closest(hoverTargets)) {
      cursorDot.classList.remove("cursor-hover");
    }
  });

  function animateCursor() {
    dotX += (mouseX - dotX) * 0.18;
    dotY += (mouseY - dotY) * 0.18;
    cursorDot.style.left = dotX + "px";
    cursorDot.style.top = dotY + "px";
    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  function updateScrollProgress() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + "%";
  }

  var frame = 0;

  function resizeCanvas() {
    var dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas, { passive: true });

  var orbs = [
    { xRatio: 0.18, yRatio: 0.28, phase: 0 },
    { xRatio: 0.82, yRatio: 0.62, phase: 2.1 },
    { xRatio: 0.5, yRatio: 0.85, phase: 4.3 },
  ];

  function drawBg() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    var cellSize = 64;
    var cols = Math.ceil(w / cellSize) + 1;
    var rows = Math.ceil(h / cellSize) + 1;

    ctx.strokeStyle = "rgba(124, 106, 255, 0.032)";
    ctx.lineWidth = 1;

    for (var i = 0; i < cols; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, h);
      ctx.stroke();
    }

    for (var j = 0; j < rows; j++) {
      ctx.beginPath();
      ctx.moveTo(0, j * cellSize);
      ctx.lineTo(w, j * cellSize);
      ctx.stroke();
    }

    orbs.forEach(function (orb) {
      var pulse = Math.sin(frame * 0.007 + orb.phase) * 0.5 + 0.5;
      var px = orb.xRatio * w;
      var py = orb.yRatio * h;
      var radius = 140 + pulse * 80;
      var alpha = 0.022 + pulse * 0.022;

      var grad = ctx.createRadialGradient(px, py, 0, px, py, radius);
      grad.addColorStop(0, "rgba(124, 106, 255, " + alpha + ")");
      grad.addColorStop(1, "rgba(124, 106, 255, 0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    frame++;
    requestAnimationFrame(drawBg);
  }

  drawBg();

  var backTop = document.getElementById("back-top");
  var heroSection = document.getElementById("hero");

  window.addEventListener(
    "scroll",
    function () {
      if (window.scrollY > 40) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
      updateScrollProgress();
      updateActiveNav();

      var heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight : 600;
      if (window.scrollY > heroBottom - 100) {
        backTop.classList.add("visible");
      } else {
        backTop.classList.remove("visible");
      }
    },
    { passive: true }
  );

  backTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  backTop.addEventListener("mouseenter", function () {
    cursorDot.classList.add("cursor-hover");
  });

  backTop.addEventListener("mouseleave", function () {
    cursorDot.classList.remove("cursor-hover");
  });

  navToggle.addEventListener("click", function () {
    var open = navToggle.classList.toggle("open");
    mobileMenu.classList.toggle("open", open);
  });

  mobileMenu.querySelectorAll(".mobile-link").forEach(function (link) {
    link.addEventListener("click", function () {
      navToggle.classList.remove("open");
      mobileMenu.classList.remove("open");
    });
  });

  function updateActiveNav() {
    var sections = ["hero", "about", "setup", "skills", "projects", "commissions", "contact"];
    var threshold = window.scrollY + 80;
    var current = "hero";

    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (docHeight > 0 && docHeight - scrollTop < 20) {
      current = sections[sections.length - 1];
    } else {
      for (var i = sections.length - 1; i >= 0; i--) {
        var el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= threshold) {
          current = sections[i];
          break;
        }
      }
    }

    document.querySelectorAll(".nav-links a").forEach(function (a) {
      var navId = a.getAttribute("data-nav");
      a.classList.toggle("nav-active", navId === current);
    });
  }

  function initScrollReveal() {
    var reveals = document.querySelectorAll(".reveal");

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var siblings = Array.from(
              el.parentElement ? el.parentElement.querySelectorAll(".reveal:not(.visible)") : []
            );
            var order = siblings.indexOf(el);
            var delay = Math.max(0, order * 65);

            setTimeout(function () {
              el.classList.add("visible");
            }, delay);

            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  var tiltCards = document.querySelectorAll(".tilt-card");

  tiltCards.forEach(function (card) {
    var inner = card.querySelector(".tilt-inner");

    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var cx = rect.width / 2;
      var cy = rect.height / 2;
      var rotX = ((y - cy) / cy) * -6;
      var rotY = ((x - cx) / cx) * 6;
      inner.style.transform = "rotateX(" + rotX + "deg) rotateY(" + rotY + "deg)";
    });

    card.addEventListener("mouseleave", function () {
      inner.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
  });

  var cmdCommands = [
    {
      group: "Navigate",
      items: [
        { label: "About", hint: "section", icon: "about", action: function () { scrollTo("#about"); } },
        { label: "Setup", hint: "section", icon: "setup", action: function () { scrollTo("#setup"); } },
        { label: "Skills", hint: "section", icon: "skills", action: function () { scrollTo("#skills"); } },
        { label: "Projects", hint: "section", icon: "projects", action: function () { scrollTo("#projects"); } },
        { label: "Commissions", hint: "section", icon: "commissions", action: function () { scrollTo("#commissions"); } },
        { label: "Contact", hint: "section", icon: "contact", action: function () { scrollTo("#contact"); } },
      ],
    },
    {
      group: "Actions",
      items: [
        { label: "Copy Discord username", hint: "Cyszxz", icon: "copy", action: function () { doCopy(); } },
        { label: "Open Discord profile", hint: "discord.com", icon: "link", action: function () { window.open("https://discord.com/users/1141849395902554202", "_blank"); } },
        { label: "Open discord.gg/cys", hint: "community", icon: "link", action: function () { window.open("https://discord.gg/cys", "_blank"); } },
      ],
    },
  ];

  function scrollTo(hash) {
    var target = document.querySelector(hash);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    closeCmd();
  }

  function doCopy() {
    copyDiscordUsername();
    closeCmd();
  }

  var cmdIconSvgs = {
    about: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-1a6 6 0 0 1 12 0v1"/></svg>',
    setup: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
    skills: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    projects: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
    commissions: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    contact: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    copy: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    link: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  };

  var cmdActiveIndex = 0;
  var flatItems = [];

  function buildFlatItems(query) {
    flatItems = [];
    cmdCommands.forEach(function (group) {
      group.items.forEach(function (item) {
        if (!query || item.label.toLowerCase().includes(query.toLowerCase())) {
          flatItems.push(item);
        }
      });
    });
  }

  function renderCmd(query) {
    cmdList.innerHTML = "";
    buildFlatItems(query);
    cmdActiveIndex = 0;

    if (flatItems.length === 0) {
      cmdList.innerHTML = '<p style="padding:16px 12px;font-size:0.82rem;color:var(--text-muted)">No results</p>';
      return;
    }

    var rendered = 0;
    cmdCommands.forEach(function (group) {
      var groupItems = group.items.filter(function (item) {
        return !query || item.label.toLowerCase().includes(query.toLowerCase());
      });

      if (groupItems.length === 0) return;

      var label = document.createElement("p");
      label.className = "cmd-section-label";
      label.textContent = group.group;
      cmdList.appendChild(label);

      groupItems.forEach(function (item) {
        var div = document.createElement("div");
        div.className = "cmd-item" + (rendered === 0 ? " cmd-active" : "");
        div.innerHTML =
          '<div class="cmd-item-icon">' +
          (cmdIconSvgs[item.icon] || "") +
          "</div>" +
          '<span class="cmd-item-label">' + item.label + "</span>" +
          '<span class="cmd-item-hint">' + (item.hint || "") + "</span>";

        div.addEventListener("click", function () {
          item.action();
        });

        div.addEventListener("mouseenter", function () {
          setActive(rendered);
        });

        div.setAttribute("data-index", rendered);
        cmdList.appendChild(div);
        rendered++;
      });
    });
  }

  function setActive(index) {
    cmdActiveIndex = index;
    var items = cmdList.querySelectorAll(".cmd-item");
    items.forEach(function (el, i) {
      el.classList.toggle("cmd-active", i === index);
    });
  }

  function openCmd() {
    cmdOverlay.classList.remove("cmd-hidden");
    cmdOverlay.classList.add("cmd-visible");
    cmdInput.value = "";
    renderCmd("");
    setTimeout(function () { cmdInput.focus(); }, 50);
  }

  function closeCmd() {
    cmdOverlay.classList.remove("cmd-visible");
    cmdOverlay.classList.add("cmd-hidden");
  }

  cmdTrigger.addEventListener("click", openCmd);
  cmdBackdrop.addEventListener("click", closeCmd);

  cmdInput.addEventListener("input", function () {
    renderCmd(cmdInput.value);
  });

  cmdInput.addEventListener("keydown", function (e) {
    var items = cmdList.querySelectorAll(".cmd-item");
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(Math.min(cmdActiveIndex + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(Math.max(cmdActiveIndex - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flatItems[cmdActiveIndex]) {
        flatItems[cmdActiveIndex].action();
      }
    } else if (e.key === "Escape") {
      closeCmd();
    }
  });

  document.addEventListener("keydown", function (e) {
    if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (cmdOverlay.classList.contains("cmd-visible")) {
        closeCmd();
      } else {
        openCmd();
      }
    }
    if (e.key === "Escape") {
      if (cmdOverlay.classList.contains("cmd-visible")) closeCmd();
      if (ctxVisible) hideCtxMenu();
    }
  });

  var copyBtn = document.getElementById("copy-btn");

  function showToast(message) {
    var toast = document.getElementById("toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      toast.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg><span>' + message + '</span>';
      document.body.appendChild(toast);
    } else {
      toast.querySelector("span").textContent = message;
    }
    toast.classList.add("show");

    if (toast.timeoutId) {
      clearTimeout(toast.timeoutId);
    }

    toast.timeoutId = setTimeout(function () {
      toast.classList.remove("show");
    }, 2500);
  }

  function copyDiscordUsername() {
    navigator.clipboard.writeText("Cyszxz").then(function () {
      showToast("Copied Discord username to clipboard");

      if (copyBtn) {
        var iconCopy = copyBtn.querySelector(".icon-copy");
        var iconCheck = copyBtn.querySelector(".icon-check");
        var copyText = copyBtn.querySelector(".copy-text");

        if (iconCopy && iconCheck && copyText) {
          iconCopy.style.display = "none";
          iconCheck.style.display = "block";
          copyText.textContent = "Copied";
          copyBtn.classList.add("copied");

          setTimeout(function () {
            iconCopy.style.display = "block";
            iconCheck.style.display = "none";
            copyText.textContent = "Copy username";
            copyBtn.classList.remove("copied");
          }, 2200);
        }
      }
    }).catch(function () {});
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", copyDiscordUsername);
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  function applyLanyardData(data) {
    var statusDot = document.getElementById("discord-status-dot");
    var statusLabel = document.getElementById("discord-status-label");
    var avatarImg = document.getElementById("discord-avatar");
    var avatarPlaceholder = document.getElementById("discord-avatar-placeholder");
    var activityEl = document.getElementById("discord-activity");

    var heroStatusDot = document.getElementById("hero-discord-status-dot");
    var heroStatusText = document.getElementById("hero-discord-text");
    var heroAvatarImg = document.getElementById("hero-discord-avatar");
    var heroAvatarPlaceholder = document.getElementById("hero-discord-avatar-placeholder");
    var heroActivityEl = document.getElementById("hero-activity");

    var cardStatusDot = document.getElementById("hero-card-status-dot");
    var cardStatusText = document.getElementById("hero-card-status-text");
    var cardAvatarWrap = document.querySelector(".hero-card-avatar-wrap");
    var cardProfileCard = document.querySelector(".hero-profile-card");
    var cardAvatarImg = document.getElementById("hero-card-avatar");
    var cardAvatarPlaceholder = document.getElementById("hero-card-avatar-placeholder");

    var status = data.discord_status || "offline";
    statusDot.className = "status-dot status-" + status;
    statusLabel.className = "status-label " + status;
    statusLabel.textContent = status === "dnd" ? "do not disturb" : status;

    if (heroStatusDot) {
      heroStatusDot.className = "hero-status-dot status-" + status;
    }
    if (heroStatusText) {
      heroStatusText.textContent = status === "dnd" ? "do not disturb" : status;
    }

    if (cardStatusDot) {
      cardStatusDot.className = "hero-card-status-dot " + status;
    }
    if (cardStatusText) {
      cardStatusText.className = "hero-card-status-text " + status;
      cardStatusText.textContent = status === "dnd" ? "do not disturb" : status;
    }
    if (cardAvatarWrap) {
      cardAvatarWrap.className = "hero-card-avatar-wrap " + status;
    }
    if (cardProfileCard) {
      cardProfileCard.className = "hero-profile-card " + status;
    }

    var user = data.discord_user;
    if (user && user.avatar) {
      var avatarUrl = "https://cdn.discordapp.com/avatars/" + user.id + "/" + user.avatar + ".png?size=128";
      avatarImg.src = avatarUrl;
      avatarImg.onload = function () {
        avatarImg.classList.add("loaded");
        avatarPlaceholder.classList.add("hidden");
      };

      if (heroAvatarImg) {
        heroAvatarImg.src = avatarUrl;
        heroAvatarImg.onload = function () {
          heroAvatarImg.classList.add("loaded");
          if (heroAvatarPlaceholder) {
            heroAvatarPlaceholder.classList.add("hidden");
          }
        };
      }

      if (cardAvatarImg) {
        cardAvatarImg.src = avatarUrl;
        cardAvatarImg.onload = function () {
          cardAvatarImg.classList.add("loaded");
          if (cardAvatarPlaceholder) {
            cardAvatarPlaceholder.classList.add("hidden");
          }
        };
      }
    }

    var activityText = null;
    var actTitle = "No Active Activity";
    var actDetails = "Status is currently quiet";
    var isSpotify = false;
    var hasRichActivity = false;

    if (data.listening_to_spotify && data.spotify) {
      activityText = "Listening to " + data.spotify.song + " by " + data.spotify.artist;
      actTitle = "Listening to Spotify";
      actDetails = data.spotify.song + " - " + data.spotify.artist;
      isSpotify = true;
      hasRichActivity = true;
    } else if (data.activities && data.activities.length > 0) {
      var act = data.activities.find(function (a) {
        return a.type === 0 || a.type === 1 || a.type === 3 || a.type === 5;
      });
      if (act) {
        var prefix = "Playing ";
        actTitle = "Playing a Game";
        if (act.type === 1) {
          prefix = "Streaming ";
          actTitle = "Streaming Live";
        }
        if (act.type === 3) {
          prefix = "Watching ";
          actTitle = "Watching Stream";
        }
        if (act.type === 5) {
          prefix = "Competing in ";
          actTitle = "Competing";
        }
        activityText = prefix + act.name;
        actDetails = act.name + (act.details ? " - " + act.details : "");
        hasRichActivity = true;
      } else {
        var custom = data.activities.find(function (a) { return a.type === 4; });
        if (custom && custom.state) {
          var emojiPrefix = "";
          if (custom.emoji && custom.emoji.name) {
            emojiPrefix = custom.emoji.name + " ";
          }
          activityText = emojiPrefix + custom.state;
          actTitle = "Custom Status";
          actDetails = activityText;
          hasRichActivity = true;
        }
      }
    }

    if (activityText) {
      activityEl.textContent = activityText;
      activityEl.style.display = "block";
      if (heroActivityEl) {
        heroActivityEl.textContent = activityText;
        heroActivityEl.style.display = "flex";
      }
    } else {
      activityEl.style.display = "none";
      if (heroActivityEl) {
        heroActivityEl.style.display = "none";
      }
    }

    var cardActivityEl = document.getElementById("hero-card-activity");
    var spotifyVis = document.getElementById("spotify-visualizer");
    var spotifyPlayerEl = document.getElementById("spotify-player");
    var spotifyAlbumArt = document.getElementById("spotify-album-art");
    var spotifySongTitle = document.getElementById("spotify-song-title");
    var spotifySongArtist = document.getElementById("spotify-song-artist");

    if (cardActivityEl) {
      var titleEl = cardActivityEl.querySelector(".hero-card-activity-title");
      var detailsEl = cardActivityEl.querySelector(".hero-card-activity-details");

      if (titleEl) titleEl.textContent = actTitle;
      if (detailsEl) detailsEl.textContent = actDetails;

      if (hasRichActivity) {
        cardActivityEl.classList.add("active");
      } else {
        cardActivityEl.classList.remove("active");
      }
    }

    if (spotifyVis) {
      if (isSpotify) {
        spotifyVis.classList.add("active");
      } else {
        spotifyVis.classList.remove("active");
      }
    }

    if (isSpotify && data.spotify) {
      if (spotifyPlayerEl) spotifyPlayerEl.classList.add("active");
      if (cardActivityEl) cardActivityEl.style.display = "none";
      if (spotifyAlbumArt && data.spotify.album_art_url) {
        spotifyAlbumArt.src = data.spotify.album_art_url;
      }
      if (spotifySongTitle) {
        spotifySongTitle.textContent = data.spotify.song;
      }
      if (spotifySongArtist) {
        spotifySongArtist.textContent = data.spotify.artist;
      }
      if (spotifyInterval) {
        clearInterval(spotifyInterval);
        spotifyInterval = null;
      }
      if (data.spotify.timestamps) {
        var start = data.spotify.timestamps.start;
        var end = data.spotify.timestamps.end;
        var duration = end - start;
        if (start && end && duration > 0) {
          var updateProgress = function () {
            var current = Date.now();
            var progress = ((current - start) / duration) * 100;
            progress = Math.max(0, Math.min(100, progress));
            var progressBar = document.getElementById("spotify-progress-bar");
            if (progressBar) {
              progressBar.style.width = progress + "%";
            }
          };
          updateProgress();
          spotifyInterval = setInterval(updateProgress, 500);
        }
      }
    } else {
      if (spotifyPlayerEl) spotifyPlayerEl.classList.remove("active");
      if (cardActivityEl) cardActivityEl.style.display = "block";
      if (spotifyInterval) {
        clearInterval(spotifyInterval);
        spotifyInterval = null;
      }
    }
  }

  function connectLanyardWS() {
    var ws;
    var heartbeatInterval;

    try {
      ws = new WebSocket(LANYARD_WS);
    } catch (e) {
      fetchLanyardRest();
      return;
    }

    ws.addEventListener("open", function () {});

    ws.addEventListener("message", function (e) {
      var msg;
      try { msg = JSON.parse(e.data); } catch (err) { return; }

      if (msg.op === 1) {
        var heartbeat = msg.d.heartbeat_interval;
        ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_ID } }));
        heartbeatInterval = setInterval(function () {
          ws.send(JSON.stringify({ op: 3 }));
        }, heartbeat);
      }

      if ((msg.op === 0 && msg.t === "INIT_STATE") || (msg.op === 0 && msg.t === "PRESENCE_UPDATE")) {
        var data = msg.d[DISCORD_ID] || msg.d;
        if (data) applyLanyardData(data);
      }
    });

    ws.addEventListener("close", function () {
      clearInterval(heartbeatInterval);
      setTimeout(connectLanyardWS, 5000);
    });

    ws.addEventListener("error", function () {
      clearInterval(heartbeatInterval);
      fetchLanyardRest();
    });
  }

  function fetchLanyardRest() {
    fetch(LANYARD_URL)
      .then(function (r) { return r.json(); })
      .then(function (json) {
        if (json.success && json.data) {
          applyLanyardData(json.data);
        }
      })
      .catch(function () {});

    setTimeout(fetchLanyardRest, 30000);
  }

  connectLanyardWS();





  function showCtxMenu(x, y) {
    var menuW = 180;
    var menuH = 120;
    var safeX = Math.min(x, window.innerWidth - menuW - 8);
    var safeY = Math.min(y, window.innerHeight - menuH - 8);
    ctxMenu.style.left = safeX + "px";
    ctxMenu.style.top = safeY + "px";
    ctxMenu.classList.add("ctx-visible");
    ctxVisible = true;
  }


  function hideCtxMenu() {
    ctxMenu.classList.remove("ctx-visible");
    ctxVisible = false;
  }

  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    showCtxMenu(e.clientX, e.clientY);
  });

  document.addEventListener("click", function (e) {
    if (ctxVisible && !ctxMenu.contains(e.target)) {
      hideCtxMenu();
    }
  });


  document.getElementById("ctx-projects").addEventListener("click", function () {
    hideCtxMenu();
    var target = document.getElementById("projects");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.getElementById("ctx-copy").addEventListener("click", function () {
    hideCtxMenu();
    copyDiscordUsername();
  });

  document.getElementById("ctx-community").addEventListener("click", function () {
    hideCtxMenu();
    window.open("https://discord.gg/cys", "_blank");
  });

  var COUNTER_URL = "https://api.counterapi.dev/v2/cyszxs-team-4186/cys-portfolio/up";

  fetch(COUNTER_URL)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var el = document.getElementById("up_count");
      if (el && data) {
        var val = null;
        if (data.data && typeof data.data.up_count === "number") {
          val = data.data.up_count;
        } else if (typeof data.count === "number") {
          val = data.count;
        } else if (typeof data.value === "number") {
          val = data.value;
        }
        if (val !== null) {
          el.textContent = val;
        }
      }
    })
    .catch(function () {});

}());
