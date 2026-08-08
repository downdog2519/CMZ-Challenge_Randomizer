/* ============================================================
   CODEX.JS — Relic Codex browser (map / tier / unlock steps)
   ============================================================ */

import { relicCodex, grimRelics, sinisterRelics, wickedRelics } from "./data.js";
import { getRelicImage, getRelicClass } from "./utils.js";

function uniqueMaps() {
    return [...new Set(relicCodex.map((r) => r.map))];
}

function uniqueTiers() {
    return ["Grim", "Sinister", "Wicked"];
}

function searchBlob(entry) {
    return [
        entry.name,
        entry.map,
        entry.tier,
        entry.effect,
        entry.requires,
        entry.trial,
        ...(entry.steps || []),
    ]
        .join(" ")
        .toLowerCase();
}

function matchesFilters(entry, mapFilter, tierFilter, query) {
    if (mapFilter && entry.map !== mapFilter) return false;
    if (tierFilter && entry.tier !== tierFilter) return false;
    if (query) {
        if (!searchBlob(entry).includes(query.toLowerCase())) return false;
    }
    return true;
}

function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
}

function renderCards(list) {
    const host = document.getElementById("codexGrid");
    const empty = document.getElementById("codexEmpty");
    if (!host) return;

    host.innerHTML = "";
    if (!list.length) {
        if (empty) empty.classList.remove("hidden");
        return;
    }
    if (empty) empty.classList.add("hidden");

    list.forEach((entry) => {
        const card = document.createElement("article");
        const tierClass = getRelicClass(entry.name, grimRelics, sinisterRelics, wickedRelics);
        card.className = `codex-card ${tierClass}`;

        const media = el("div", "codex-media");
        const img = document.createElement("img");
        img.className = "codex-img";
        img.alt = entry.name;
        img.src = `./images/relics/${getRelicImage(entry.name)}`;
        img.onerror = () => {
            img.style.opacity = "0.25";
        };
        media.appendChild(img);

        const body = el("div", "codex-body");
        body.appendChild(el("h3", "codex-name chalk-text", entry.name));

        const meta = el("div", "codex-meta");
        meta.appendChild(el("span", "codex-pill tier", `${entry.tier} · ${entry.points}pt`));
        meta.appendChild(el("span", "codex-pill map", entry.map));
        if (entry.requires) {
            meta.appendChild(el("span", "codex-pill req", entry.requires));
        }
        body.appendChild(meta);

        if (entry.effect) {
            const effect = el("p", "codex-effect");
            effect.appendChild(el("strong", null, "Effect: "));
            effect.appendChild(document.createTextNode(entry.effect));
            body.appendChild(effect);
        }

        body.appendChild(el("p", "codex-section-label", "Unlock steps"));
        const steps = el("ol", "codex-steps");
        (entry.steps || []).forEach((step) => {
            steps.appendChild(el("li", null, step));
        });
        body.appendChild(steps);

        if (entry.trial) {
            const trial = el("p", "codex-trial");
            trial.appendChild(el("strong", null, "Trial: "));
            trial.appendChild(document.createTextNode(entry.trial));
            body.appendChild(trial);
        }

        card.appendChild(media);
        card.appendChild(body);
        host.appendChild(card);
    });
}

function refresh() {
    const mapFilter = document.getElementById("codexMapFilter")?.value || "";
    const tierFilter = document.getElementById("codexTierFilter")?.value || "";
    const query = document.getElementById("codexSearch")?.value?.trim() || "";
    const list = relicCodex.filter((e) => matchesFilters(e, mapFilter, tierFilter, query));
    const count = document.getElementById("codexCount");
    if (count) count.textContent = `${list.length} / ${relicCodex.length} relics`;
    renderCards(list);
}

export function setupCodex() {
    const mapSel = document.getElementById("codexMapFilter");
    const tierSel = document.getElementById("codexTierFilter");
    if (mapSel && mapSel.options.length <= 1) {
        uniqueMaps().forEach((m) => {
            const opt = document.createElement("option");
            opt.value = m;
            opt.textContent = m;
            mapSel.appendChild(opt);
        });
    }
    if (tierSel && tierSel.options.length <= 1) {
        uniqueTiers().forEach((t) => {
            const opt = document.createElement("option");
            opt.value = t;
            opt.textContent = t;
            tierSel.appendChild(opt);
        });
    }

    ["codexMapFilter", "codexTierFilter", "codexSearch"].forEach((id) => {
        const node = document.getElementById(id);
        if (!node) return;
        node.addEventListener("input", refresh);
        node.addEventListener("change", refresh);
    });

    const page = document.getElementById("relicCodexPage");
    if (page) {
        page.addEventListener("cmz:show", refresh);
    }

    refresh();
}
