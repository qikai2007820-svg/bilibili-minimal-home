(() => {
  "use strict";

  // Content scripts run in an isolated world. This guard also protects against
  // accidental reinjection while the same document is open.
  if (window.__bilibiliMinimalHomeInstalled) return;
  window.__bilibiliMinimalHomeInstalled = true;

  const ACTIVE_CLASS = "bmh-active";
  const PENDING_CLASS = "bmh-pending";
  const HERO_ID = "bmh-hero";
  const HOME_ORIGIN = "https://www.bilibili.com";
  const SEARCH_PLACEHOLDER = "你所热爱的，就是你的生活。";

  let active = false;
  let scheduled = false;
  let lastUrl = location.href;
  let nativeNodes = null;
  let missingTimer = null;
  let panelObserver = null;
  let observedPanel = null;
  let inputObserver = null;
  let observedInput = null;
  let nativePlaceholder = null;
  let nativeTitle = null;
  let pendingTimer = null;
  let pendingTimedOut = false;

  function isRootHome() {
    return location.origin === HOME_ORIGIN && location.pathname === "/";
  }

  function clearPendingTimer() {
    if (pendingTimer !== null) {
      clearTimeout(pendingTimer);
      pendingTimer = null;
    }
  }

  function beginPending() {
    if (!isRootHome() || active || pendingTimedOut) return;
    document.documentElement?.classList.add(PENDING_CLASS);
    if (pendingTimer !== null) return;
    // Reveal the original site if its native search never appears.
    pendingTimer = setTimeout(() => {
      pendingTimer = null;
      pendingTimedOut = true;
      document.documentElement?.classList.remove(PENDING_CLASS);
    }, 8000);
  }

  function endPending() {
    clearPendingTimer();
    document.documentElement?.classList.remove(PENDING_CLASS);
  }

  // CSS is injected before this document_start script, so the first paint can
  // use the neutral loading background while Bilibili builds its native DOM.
  beginPending();

  function findNativeNodes() {
    const header = document.querySelector(".bili-header");
    const form = header?.querySelector("#nav-searchform");
    const input = form?.querySelector(".nav-search-input");
    const search = form?.closest(".center-search-container");
    const account = header?.querySelector(".right-entry__main");
    const panel = search?.querySelector(".nav-search-panel");

    if (!header || !form || !input || !search || !account || !panel) {
      return null;
    }
    return { header, form, input, search, account, panel };
  }

  function makeHero() {
    const hero = document.createElement("div");
    hero.id = HERO_ID;
    hero.setAttribute("aria-label", "Bilibili 极简首页");

    const wordmark = document.createElement("div");
    wordmark.className = "bmh-wordmark";
    wordmark.append("bili");
    const accent = document.createElement("span");
    accent.textContent = "bili";
    wordmark.append(accent);

    const tagline = document.createElement("div");
    tagline.className = "bmh-tagline";
    tagline.textContent = "只在你主动寻找时展示内容。";

    hero.append(wordmark, tagline);
    return hero;
  }

  function unwatchInput() {
    inputObserver?.disconnect();
    inputObserver = null;
    if (observedInput?.isConnected) {
      if (nativePlaceholder === null) observedInput.removeAttribute("placeholder");
      else observedInput.setAttribute("placeholder", nativePlaceholder);
      if (nativeTitle === null) observedInput.removeAttribute("title");
      else observedInput.setAttribute("title", nativeTitle);
    }
    observedInput = null;
    nativePlaceholder = null;
    nativeTitle = null;
  }

  function watchInput(input) {
    if (observedInput === input) return;
    unwatchInput();
    observedInput = input;
    nativePlaceholder = input.getAttribute("placeholder");
    nativeTitle = input.getAttribute("title");
    input.setAttribute("placeholder", SEARCH_PLACEHOLDER);
    input.setAttribute("title", SEARCH_PLACEHOLDER);
    inputObserver = new MutationObserver(() => {
      const placeholder = input.getAttribute("placeholder");
      const title = input.getAttribute("title");
      if (placeholder !== SEARCH_PLACEHOLDER) {
        nativePlaceholder = placeholder;
        input.setAttribute("placeholder", SEARCH_PLACEHOLDER);
      }
      if (title !== SEARCH_PLACEHOLDER) {
        nativeTitle = title;
        input.setAttribute("title", SEARCH_PLACEHOLDER);
      }
    });
    inputObserver.observe(input, {
      attributes: true,
      attributeFilter: ["placeholder", "title"]
    });
  }

  function hideTrending(panel) {
    // The current site uses .trending. The exact heading check also covers a
    // future wrapper rename without touching search history or suggestions.
    for (const child of panel.children) {
      const title = child.querySelector(".header .title, .title");
      if (
        child.classList.contains("trending") ||
        title?.textContent.trim() === "bilibili热搜"
      ) {
        child.classList.add("bmh-hot-search");
      }
    }
    // When hot search is the only content, hide its now-empty container too.
    panel.classList.toggle(
      "bmh-empty-panel",
      [...panel.children].every(child =>
        child.classList.contains("trending") ||
        child.classList.contains("bmh-hot-search")
      )
    );
  }

  function watchPanel(panel) {
    if (observedPanel === panel) return;
    panelObserver?.disconnect();
    observedPanel = panel;
    hideTrending(panel);
    panelObserver = new MutationObserver(() => hideTrending(panel));
    panelObserver.observe(panel, { childList: true, subtree: true, characterData: true });
  }

  function clearMissingTimer() {
    if (missingTimer !== null) {
      clearTimeout(missingTimer);
      missingTimer = null;
    }
  }

  function deactivate() {
    clearMissingTimer();
    endPending();
    pendingTimedOut = false;
    panelObserver?.disconnect();
    panelObserver = null;
    observedPanel?.classList.remove("bmh-empty-panel");
    observedPanel?.querySelectorAll(".bmh-hot-search").forEach(node => {
      node.classList.remove("bmh-hot-search");
    });
    observedPanel = null;
    unwatchInput();
    document.documentElement?.classList.remove(ACTIVE_CLASS);
    document.getElementById(HERO_ID)?.remove();
    nativeNodes = null;
    active = false;
  }

  function sync() {
    scheduled = false;
    lastUrl = location.href;

    if (!isRootHome()) {
      if (active) deactivate();
      else {
        endPending();
        pendingTimedOut = false;
      }
      return;
    }

    const found = findNativeNodes();
    if (!found) {
      if (!active) beginPending();
      // A brief Vue replacement should not flash the recommendation feed.
      // If Bilibili removes the native components entirely, reveal its page.
      if (active && missingTimer === null) {
        missingTimer = setTimeout(() => {
          missingTimer = null;
          if (isRootHome() && !findNativeNodes()) {
            deactivate();
            pendingTimedOut = true;
          }
        }, 3000);
      }
      return;
    }

    clearMissingTimer();
    nativeNodes = found;
    if (!document.getElementById(HERO_ID)) {
      document.body.append(makeHero());
    }
    document.documentElement.classList.add(ACTIVE_CLASS);
    endPending();
    pendingTimedOut = false;
    active = true;
    watchInput(found.input);
    watchPanel(found.panel);
  }

  function scheduleSync() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(sync);
  }

  const pageObserver = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      scheduleSync();
      return;
    }
    if (!isRootHome()) return;
    if (
      !active ||
      !nativeNodes ||
      !nativeNodes.header.isConnected ||
      !nativeNodes.search.isConnected ||
      !nativeNodes.input.isConnected ||
      !nativeNodes.account.isConnected ||
      !nativeNodes.panel.isConnected ||
      !document.getElementById(HERO_ID)
    ) {
      scheduleSync();
    }
  });

  pageObserver.observe(document, { childList: true, subtree: true });
  addEventListener("popstate", scheduleSync);
  addEventListener("hashchange", scheduleSync);
  // pushState does not fire popstate, and a route may change before its DOM.
  setInterval(() => {
    if (location.href !== lastUrl) scheduleSync();
  }, 1000);
  scheduleSync();
})();
