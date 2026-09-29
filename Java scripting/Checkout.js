// checkout-validation.js
// Include at the end of the page: <script src="checkout-validation.js"></script>

(() => {
    const form = document.getElementById("checkout-form");
    const cardFields = document.getElementById("card-fields");
    const codMessage = document.getElementById("cod-message");

    // ---------- Helpers ----------
    const $ = (id) => document.getElementById(id);
    const isCard = () => form.elements.payment.value === "card";

    // ---------- Rules: each returns an error message, or "" if valid ----------
    const namePattern = /^[A-Za-z\u00C0-\u024F][A-Za-z\u00C0-\u024F\s'-]*$/;

    const rules = {
        "first-name": (v) => {
            if (!v) return "Please enter your first name.";
            if (v.length < 2) return "First name must be at least 2 characters.";
            if (!namePattern.test(v)) return "Use letters only (spaces, - and ' are allowed).";
            return "";
        },
        "last-name": (v) => {
            if (!v) return "Please enter your last name.";
            if (v.length < 2) return "Last name must be at least 2 characters.";
            if (!namePattern.test(v)) return "Use letters only (spaces, - and ' are allowed).";
            return "";
        },
        email: (v) => {
            if (!v) return "Please enter your email address.";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Enter a valid email, e.g. you@example.com.";
            return "";
        },
        phone: (v) => {
            if (!v) return "Please enter your phone number.";
            const cleaned = v.replace(/[\s\-()]/g, "");
            if (!/^(?:\+94|0)7\d{8}$/.test(cleaned)) return "Enter a valid mobile number, e.g. 071 234 5678.";
            return "";
        },
        address: (v) => {
            if (!v) return "Please enter your delivery address.";
            if (v.length < 5) return "Address looks too short.";
            return "";
        },
        city: (v) => {
            if (!v) return "Please enter your city.";
            if (v.length < 2 || !namePattern.test(v)) return "Enter a valid city name.";
            return "";
        },
        state: (v) => {
            if (!v) return "Please enter your state / province.";
            if (v.length < 2 || !namePattern.test(v)) return "Enter a valid state / province.";
            return "";
        },
        country: (v) => {
            if (!v) return "Please enter your country.";
            if (v.length < 2 || !namePattern.test(v)) return "Enter a valid country name.";
            return "";
        },
        "card-number": (v) => {
            const digits = v.replace(/\s/g, "");
            if (!digits) return "Please enter your card number.";
            if (!/^\d+$/.test(digits)) return "Card number can only contain digits.";
            if (digits.length < 13 || digits.length > 19) return "Card number must be 13–19 digits.";
            return "";
        },
        expiry: (v) => {
            if (!v) return "Please enter the expiry date.";
            const match = /^(\d{2})\/(\d{2})$/.exec(v);
            if (!match) return "Use the format MM/YY.";
            const month = Number(match[1]);
            const year = 2000 + Number(match[2]);
            if (month < 1 || month > 12) return "Month must be between 01 and 12.";
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth() + 1;
            if (year < currentYear || (year === currentYear && month < currentMonth)) return "This card has expired.";
            if (year > currentYear + 20) return "Expiry year looks too far in the future.";
            return "";
        },
        cvc: (v) => {
            if (!v) return "Please enter the CVC.";
            if (!/^\d{3,4}$/.test(v)) return "CVC must be 3 or 4 digits.";
            return "";
        },
    };

    const cardOnly = new Set(["card-number", "expiry", "cvc"]);

    // ---------- Show / clear errors ----------
    function setError(input, message) {
        const errorEl = $(`${input.id}-error`);
        if (errorEl) errorEl.textContent = message;
        input.classList.toggle("invalid", Boolean(message));
        input.setAttribute("aria-invalid", message ? "true" : "false");
        if (errorEl) input.setAttribute("aria-describedby", errorEl.id);
    }

    function validateField(input) {
        const rule = rules[input.id];
        if (!rule) return true;
        if (cardOnly.has(input.id) && !isCard()) {
            setError(input, "");
            return true;
        }
        const message = rule(input.value.trim());
        setError(input, message);
        return !message;
    }

    // ---------- Live input formatting ----------
    $("card-number").addEventListener("input", (e) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
        e.target.value = digits.replace(/(.{4})/g, "$1 ").trim();
    });

    $("expiry").addEventListener("input", (e) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
        e.target.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    });

    $("cvc").addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4);
    });

    // ---------- Validate as the user types / leaves a field ----------
    Object.keys(rules).forEach((id) => {
        const input = $(id);
        if (!input) return;

        // On leaving the field
        input.addEventListener("blur", () => validateField(input));

        // While typing: only re-check if an error is already showing,
        // so users aren't nagged before they finish typing
        input.addEventListener("input", () => {
            if (input.classList.contains("invalid")) validateField(input);
        });
    });

    // ---------- Payment method toggle ----------
    function updatePaymentView() {
        const card = isCard();
        cardFields.hidden = !card;
        codMessage.hidden = card;

        if (!card) {
            ["card-number", "expiry", "cvc"].forEach((id) => setError($(id), ""));
        }
    }

    form.querySelectorAll('input[name="payment"]').forEach((radio) => {
        radio.addEventListener("change", updatePaymentView);
    });
    updatePaymentView();

    // ---------- Submit ----------
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let firstInvalid = null;
        Object.keys(rules).forEach((id) => {
            const input = $(id);
            if (input && !validateField(input) && !firstInvalid) firstInvalid = input;
        });

        if (firstInvalid) {
            firstInvalid.focus();
            firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

                // Block empty carts
        let order = null;
        try { order = JSON.parse(localStorage.getItem("toyHeavenOrder")); } catch (err) {}
        if (!order || !Array.isArray(order.items) || order.items.length === 0) {
            $("empty-cart-dialog").showModal();
            return;
        }

        const orderNumber = "TOY-" + Math.random().toString(36).slice(2, 8).toUpperCase();
        const firstName = $("first-name").value.trim();

        $("success-message").textContent = `Thanks, ${firstName}! Your order has been placed successfully.`;
        $("success-order-number").textContent = `Order #${orderNumber}`;

        // Order is placed: clear the cart, order and coupon
        try {
            localStorage.removeItem("toyHeavenCart");
            localStorage.removeItem("toyHeavenOrder");
            localStorage.removeItem("toyHeavenCoupon");
        } catch (err) {}

        $("success-dialog").showModal();
    });
})();