(function () {
  "use strict";

  var STORE_KEY = "demobuild4.v1";
  var CHANNELS = ["Amazon", "Shopify", "eBay", "Etsy"];
  var MARKETS = ["US", "UK", "EU", "Canada", "Australia"];

  // Each question maps to one pillar. 0 = best, 1 = worst for zero-risk selling readiness.
  var QUESTIONS = [
    {
      id: "trafficSources",
      pillar: "traffic",
      q: "How many active traffic sources bring visitors?",
      why: "Traffic is the first thing to check — no visitors means no sales, whatever else is right.",
      options: [
        { label: "3 or more (ads, social, search…)", score: 100 },
        { label: "2 sources", score: 70 },
        { label: "1 source", score: 40 },
        { label: "None active", score: 0 }
      ]
    },
    {
      id: "weeklyVisitors",
      pillar: "traffic",
      q: "Roughly how many visitors do you get per week?",
      why: "Volume shows whether the funnel problem is traffic or conversion.",
      options: [
        { label: "500+", score: 100 },
        { label: "100–500", score: 80 },
        { label: "Under 100", score: 45 },
        { label: "I don't know", score: 20 }
      ]
    },
    {
      id: "listingPhotos",
      pillar: "listings",
      q: "Do your listings have 5+ photos, full descriptions, and filled attributes?",
      why: "Incomplete listings underperform in search and lose buyers who do arrive.",
      options: [
        { label: "All listings complete", score: 100 },
        { label: "Most, some gaps", score: 70 },
        { label: "Under half complete", score: 35 },
        { label: "Not sure", score: 20 }
      ]
    },
    {
      id: "listingKeywords",
      pillar: "listings",
      q: "Do titles and descriptions use words buyers actually search for?",
      why: "Keyword-fit decides whether you appear when demand already exists.",
      options: [
        { label: "Researched per product", score: 100 },
        { label: "Guessed from the product", score: 55 },
        { label: "Haven't checked", score: 15 }
      ]
    },
    {
      id: "priceCheck",
      pillar: "pricing",
      q: "How does your price sit against similar offers in the same market?",
      why: "Price gaps of 10%+ push buyers to the other listing.",
      options: [
        { label: "Checked recently, in range", score: 100 },
        { label: "Checked once, at launch", score: 60 },
        { label: "Never compared", score: 15 }
      ]
    },
    {
      id: "feesCheck",
      pillar: "pricing",
      q: "Have you confirmed the price still clears fees, shipping, and tax after costs?",
      why: "A price that ignores fees can win the sale and still lose money.",
      options: [
        { label: "Yes, margin per SKU", score: 100 },
        { label: "Rough estimate", score: 60 },
        { label: "No", score: 10 }
      ]
    },
    {
      id: "checkoutTest",
      pillar: "checkout",
      q: "Have you placed a full test order on each channel recently?",
      why: "A broken checkout quietly stops every sale on that channel.",
      options: [
        { label: "Yes, both channels", score: 100 },
        { label: "One channel", score: 50 },
        { label: "No", score: 0 }
      ]
    },
    {
      id: "pageSpeed",
      pillar: "checkout",
      q: "How does the product page load feel on a phone?",
      why: "Slow pages lose buyers before they ever see the buy button.",
      options: [
        { label: "Fast (under 3s)", score: 100 },
        { label: "Okay, sometimes slow", score: 65 },
        { label: "Slow / haven't checked", score: 25 }
      ]
    },
    {
      id: "paymentsSetup",
      pillar: "checkout",
      q: "Are all payment methods for your markets switched on?",
      why: "Missing local payment options block buyers in the US and UK differently.",
      options: [
        { label: "Yes, verified in settings", score: 100 },
        { label: "Assumed default is fine", score: 40 },
        { label: "Not checked", score: 10 }
      ]
    },
    {
      id: "taxSetup",
      pillar: "taxregion",
      q: "Is tax collection set up for each market you sell in?",
      why: "Wrong tax settings can suppress listings or stop checkout in a region.",
      options: [
        { label: "Set up and verified per market", score: 100 },
        { label: "Partially set up", score: 55 },
        { label: "Not set up", score: 0 }
      ]
    },
    {
      id: "regionListing",
      pillar: "taxregion",
      q: "Are your listings live and buyable in every market you selected?",
      why: "Products are often enabled in one country but not another.",
      options: [
        { label: "Yes, checked each market", score: 100 },
        { label: "Assumed yes", score: 45 },
        { label: "No", score: 0 }
      ]
    },
    {
      id: "adSpend",
      pillar: "ads",
      q: "Do you run any paid ads, and do they at least pay for themselves?",
      why: "Ads are the fastest lever to test demand — only if they convert.",
      options: [
        { label: "Yes, profitable", score: 100 },
        { label: "Yes, but unprofitable", score: 45 },
        { label: "No ads yet", score: 30 }
      ]
    }
  ];

  var PILLARS = [
    { id: "traffic", name: "Traffic", order: 1 },
    { id: "listings", name: "Listings", order: 2 },
    { id: "pricing", name: "Pricing", order: 3 },
    { id: "checkout", name: "Checkout", order: 4 },
    { id: "taxregion", name: "Tax & region", order: 5 },
    { id: "ads", name: "Ads", order: 6 }
  ];

  // Blockers reference question ids; they surface when a pillar score is weak
  // or a specific answer signals a hard stop. impact = estimated sales drag.
  var BLOCKERS = [
    {
      id: "no-traffic",
      when: function (s, p) { return p.traffic !== null && p.traffic < 50; },
      impact: 10,
      title: "No steady source of visitors",
      why: function (p) {
        return "Your traffic pillar scores " + p.traffic + "/100. Without a steady flow of visitors, no listing can convert — fixing anything else first would not move sales.";
      },
      action: "Pick one channel where your buyer already spends time and set a daily 20-minute routine to post and answer there for two weeks."
    },
    {
      id: "checkout-broken",
      when: function (s, p) { return s.checkoutTest === 0; },
      impact: 10,
      title: "Checkout may be silently broken",
      why: function () {
        return "No recent test order means you cannot be sure any buyer can actually pay. This is the cheapest possible check.";
      },
      action: "Place one real test order on every channel today and refund it. Note any step where you would have abandoned."
    },
    {
      id: "market-not-live",
      when: function (s, p) { return s.regionListing === 0; },
      impact: 9,
      title: "Listings may not be live in all your markets",
      why: function () {
        return "A product enabled in the US is not automatically buyable in the UK. Buyers in a missing market see nothing at all.";
      },
      action: "Open each market (use the channel's regional view or a VPN) and confirm your main products are visible and purchasable."
    },
    {
      id: "tax-block",
      when: function (s, p) { return s.taxSetup === 0; },
      impact: 8,
      title: "Tax collection is not set up",
      why: function () {
        return "Missing tax setup can suppress listings or block checkout in a region, and creates compliance risk later.";
      },
      action: "Enable tax collection for each market in channel settings and record the tax registration you used."
    },
    {
      id: "payments-off",
      when: function (s, p) { return s.paymentsSetup !== null && s.paymentsSetup <= 40; },
      impact: 7,
      title: "Payment methods may be incomplete",
      why: function () {
        return "US and UK buyers default to different payment methods; missing ones cut conversion for no other reason.";
      },
      action: "In payment settings, switch on every method available for your markets and re-run a test order."
    },
    {
      id: "listing-gaps",
      when: function (s, p) { return s.listingPhotos !== null && s.listingPhotos < 70; },
      impact: 6,
      title: "Listings are incomplete",
      why: function () {
        return "Thin listings rank lower in search and convert worse, so both traffic and sales suffer.";
      },
      action: "Bring your three best products to full spec: 5 photos, complete attributes, and a description that answers the top three buyer questions."
    },
    {
      id: "keywords-missing",
      when: function (s, p) { return s.listingKeywords !== null && s.listingKeywords < 70; },
      impact: 6,
      title: "Titles are not built around searches",
      why: function () {
        return "Buyers find products through search terms; un-researched titles make you invisible to existing demand.";
      },
      action: "For your three best products, write down the exact words a buyer would type, and put those words in the title."
    },
    {
      id: "price-blind",
      when: function (s, p) { return s.priceCheck !== null && s.priceCheck < 70; },
      impact: 5,
      title: "Price is not benchmarked",
      why: function () {
        return "You cannot tell whether price is losing the sale or the offer is fine and the problem is elsewhere.";
      },
      action: "Find the three closest competing offers per product and write your price gap next to each."
    },
    {
      id: "margin-blind",
      when: function (s, p) { return s.feesCheck !== null && s.feesCheck < 70; },
      impact: 5,
      title: "Fees and margin are unverified",
      why: function () {
        return "Even a winning price can lose money once referral, payment, and shipping fees apply.";
      },
      action: "For your top product, add up all fees and shipping and write the real profit per unit."
    },
    {
      id: "ads-unprofitable",
      when: function (s, p) { return s.adSpend === 45; },
      impact: 4,
      title: "Ads are running at a loss",
      why: function () {
        return "Unprofitable ads drain budget that should go into fixing the funnel first.";
      },
      action: "Pause the worst-performing campaign for two weeks and spend that time on the higher-impact fixes above."
    },
    {
      id: "slow-page",
      when: function (s, p) { return s.pageSpeed !== null && s.pageSpeed < 65; },
      impact: 3,
      title: "Product pages load slowly",
      why: function () {
        return "Slow pages lose mobile buyers before they see the price.";
      },
      action: "Compress your largest product images and re-check the page on a phone."
    },
    {
      id: "young-store",
      when: function (s, p) { return s.weeksLive !== null && s.weeksLive < 4; },
      impact: 2,
      title: "Store is very new",
      why: function () {
        return "Under four weeks live, channels have little data and search has not indexed you fully yet — sequence matters more than speed.";
      },
      action: "Keep changes small and weekly: complete one product listing and one traffic routine per week."
    }
  ];

  var SAMPLE = {
    channels: ["Amazon", "Shopify"],
    markets: ["US", "UK"],
    weeksLive: 52,
    answers: {
      trafficSources: 40,
      weeklyVisitors: 45,
      listingPhotos: 70,
      listingKeywords: 55,
      priceCheck: 60,
      feesCheck: 10,
      checkoutTest: 50,
      pageSpeed: 65,
      paymentsSetup: 40,
      taxSetup: 0,
      regionListing: 0,
      adSpend: 30
    }
  };

  var state = load();

  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return blank();
      var parsed = JSON.parse(raw);
      var base = blank();
      for (var k in base) {
        if (Object.prototype.hasOwnProperty.call(parsed, k)) base[k] = parsed[k];
      }
      return base;
    } catch (e) {
      return blank();
    }
  }

  function blank() {
    return { channels: [], markets: [], weeksLive: null, answers: {}, done: {} };
  }

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
  }

  function el(id) { return document.getElementById(id); }

  function pillarScores() {
    var out = {};
    PILLARS.forEach(function (p) {
      var qs = QUESTIONS.filter(function (q) { return q.pillar === p.id; });
      var total = 0, count = 0;
      qs.forEach(function (q) {
        var a = state.answers[q.id];
        if (typeof a === "number") { total += a; count += 1; }
      });
      out[p.id] = count ? Math.round(total / count) : null;
    });
    return out;
  }

  function overallScore(pillars) {
    var vals = PILLARS.map(function (p) { return pillars[p.id]; }).filter(function (v) { return v !== null; });
    if (!vals.length) return null;
    return Math.round(vals.reduce(function (a, b) { return a + b; }, 0) / vals.length);
  }

  function answeredCount() {
    return Object.keys(state.answers).filter(function (k) {
      return typeof state.answers[k] === "number";
    }).length;
  }

  function render() {
    renderSetup();
    renderSurvey();
    renderResults();
    renderPlan();
  }

  function renderSetup() {
    renderChips(el("channelChips"), CHANNELS, state.channels, function (on, name) {
      state.channels = on ? state.channels.concat(name) : state.channels.filter(function (c) { return c !== name; });
      save(); render();
    });
    renderChips(el("marketChips"), MARKETS, state.markets, function (on, name) {
      state.markets = on ? state.markets.concat(name) : state.markets.filter(function (m) { return m !== name; });
      save(); render();
    });
    var weeks = el("weeksLive");
    if (document.activeElement !== weeks) weeks.value = state.weeksLive === null ? "" : state.weeksLive;
    var hint = el("weeksHint");
    if (state.weeksLive === null) {
      hint.textContent = "Used only to suggest pacing — a newer store gets smaller steps.";
    } else if (state.weeksLive < 4) {
      hint.textContent = "Very new: expect slow first weeks while search indexes your listings.";
    } else if (state.weeksLive > 26) {
      hint.textContent = "Live a while: with traffic this low, the fixes in your plan come before spending more.";
    } else {
      hint.textContent = "Settling in: complete listings first, then test one traffic source at a time.";
    }
  }

  function renderChips(node, items, selected, onToggle) {
    node.innerHTML = "";
    items.forEach(function (name) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (selected.indexOf(name) >= 0 ? " on" : "");
      b.setAttribute("aria-pressed", selected.indexOf(name) >= 0 ? "true" : "false");
      b.textContent = name;
      b.addEventListener("click", function () {
        onToggle(selected.indexOf(name) < 0, name);
      });
      node.appendChild(b);
    });
  }

  function renderSurvey() {
    var wrap = el("questionList");
    wrap.innerHTML = "";
    QUESTIONS.forEach(function (q) {
      var box = document.createElement("div");
      box.className = "question";

      var p = document.createElement("p");
      p.textContent = q.q;
      box.appendChild(p);

      var why = document.createElement("p");
      why.className = "why";
      why.textContent = q.why;
      box.appendChild(why);

      var opts = document.createElement("div");
      opts.className = "options";
      q.options.forEach(function (o) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "opt" + (state.answers[q.id] === o.score ? " on" : "");
        b.textContent = o.label;
        b.addEventListener("click", function () {
          if (state.answers[q.id] === o.score) {
            delete state.answers[q.id]; // second tap clears
          } else {
            state.answers[q.id] = o.score;
          }
          save(); render();
        });
        opts.appendChild(b);
      });
      box.appendChild(opts);
      wrap.appendChild(box);
    });
    el("progressLabel").textContent = answeredCount() + " of " + QUESTIONS.length + " answered";
  }

  function renderResults() {
    var pillars = pillarScores();
    var overall = overallScore(pillars);
    el("overallWrap").innerHTML = "";
    if (overall !== null) {
      var span = document.createElement("span");
      span.className = "overall";
      span.textContent = "Overall " + overall + "/100";
      el("overallWrap").appendChild(span);
    }

    var grid = el("pillarGrid");
    grid.innerHTML = "";
    PILLARS.forEach(function (p) {
      var score = pillars[p.id];
      var card = document.createElement("div");
      card.className = "pillar";

      var top = document.createElement("div");
      top.className = "pillar-top";
      var h = document.createElement("h4");
      h.textContent = p.name;
      top.appendChild(h);
      var s = document.createElement("span");
      s.className = "score";
      s.textContent = score === null ? "—" : score;
      top.appendChild(s);
      card.appendChild(top);

      var bar = document.createElement("div");
      bar.className = "bar";
      var fill = document.createElement("i");
      fill.style.width = (score === null ? 0 : score) + "%";
      bar.appendChild(fill);
      card.appendChild(bar);

      var why = document.createElement("p");
      why.className = "why";
      why.textContent = score === null
        ? "No answers yet — score appears once you answer a question here."
        : "From your " + QUESTIONS.filter(function (q) { return q.pillar === p.id && typeof state.answers[q.id] === "number"; }).length +
          " answered question" + (QUESTIONS.filter(function (q) { return q.pillar === p.id && typeof state.answers[q.id] === "number"; }).length === 1 ? "" : "s") +
          " in " + p.name.toLowerCase() + ".";
      card.appendChild(why);
      grid.appendChild(card);
    });

    var list = el("blockerList");
    list.innerHTML = "";
    var active = activeBlockers(pillars);
    if (!active.length) {
      var empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = answeredCount()
        ? "No likely blockers from your answers so far — keep answering to confirm."
        : "Answer the diagnostic above and your likely blockers will rank here.";
      list.appendChild(empty);
      return;
    }
    active.forEach(function (b) {
      var box = document.createElement("div");
      box.className = "blocker";

      var head = document.createElement("div");
      head.className = "blocker-head";
      var h = document.createElement("h4");
      h.textContent = b.title;
      head.appendChild(h);
      var tag = document.createElement("span");
      tag.className = "impact";
      tag.textContent = "impact " + b.impact + "/10";
      head.appendChild(tag);
      box.appendChild(head);

      var why = document.createElement("p");
      why.className = "why";
      why.textContent = b.why(pillars, state);
      box.appendChild(why);

      var act = document.createElement("label");
      act.className = "action" + (state.done[b.id] ? " done" : "");
      var cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = !!state.done[b.id];
      cb.addEventListener("change", function () {
        state.done[b.id] = cb.checked;
        save(); renderPlan();
      });
      act.appendChild(cb);
      var text = document.createElement("span");
      text.className = "text";
      text.textContent = b.action;
      act.appendChild(text);
      box.appendChild(act);

      list.appendChild(box);
    });
  }

  function activeBlockers(pillars) {
    var answers = state.answers;
    var s = {
      trafficSources: answers.trafficSources,
      checkoutTest: answers.checkoutTest,
      regionListing: answers.regionListing,
      taxSetup: answers.taxSetup,
      paymentsSetup: answers.paymentsSetup,
      listingPhotos: answers.listingPhotos,
      listingKeywords: answers.listingKeywords,
      priceCheck: answers.priceCheck,
      feesCheck: answers.feesCheck,
      adSpend: answers.adSpend,
      pageSpeed: answers.pageSpeed,
      weeksLive: state.weeksLive
    };
    return BLOCKERS.filter(function (b) { return b.when(s, pillars); })
      .sort(function (a, b) { return b.impact - a.impact; });
  }

  function renderPlan() {
    var list = el("planList");
    list.innerHTML = "";
    var active = activeBlockers(pillarScores());
    if (!active.length) {
      var empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "Your plan fills in as likely blockers appear above.";
      list.appendChild(empty);
    } else {
      active.forEach(function (b) {
        var item = document.createElement("label");
        item.className = "plan-item" + (state.done[b.id] ? " done" : "");
        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = !!state.done[b.id];
        cb.addEventListener("change", function () {
          state.done[b.id] = cb.checked;
          save(); renderPlan();
        });
        item.appendChild(cb);
        var text = document.createElement("span");
        text.className = "text";
        text.textContent = b.action;
        item.appendChild(text);
        list.appendChild(item);
      });
    }
    var doneCount = active.filter(function (b) { return state.done[b.id]; }).length;
    el("planProgress").textContent = doneCount + " of " + active.length + " done";
  }

  el("sampleButton").addEventListener("click", function () {
    state = JSON.parse(JSON.stringify(SAMPLE));
    state.done = {};
    save();
    render();
  });

  el("resetButton").addEventListener("click", function () {
    var dialog = el("resetDialog");
    dialog.showModal();
  });

  el("resetDialog").addEventListener("close", function () {
    if (el("resetDialog").returnValue === "confirm") {
      state = blank();
      try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
      render();
    }
  });

  el("weeksLive").addEventListener("input", function (e) {
    var v = e.target.value;
    state.weeksLive = v === "" ? null : Math.max(0, Math.min(520, parseInt(v, 10) || 0));
    save(); renderSetup(); renderResults(); renderPlan();
  });

  render();
})();
