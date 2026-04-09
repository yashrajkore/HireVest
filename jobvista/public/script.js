function toggleChat() {
    const chat = document.getElementById('chat-window');
    chat.style.display = chat.style.display === 'flex' ? 'none' : 'flex';
}

function handleEnter(event) {
    if (event.key === 'Enter') processCommand();
}

function processCommand() {
    const input = document.getElementById('chat-input');
    const body = document.getElementById('chat-body');
    const text = input.value.toLowerCase().trim();

    if (!text) return;

    body.innerHTML += `<div class="user-msg">${input.value}</div>`;
    input.value = "";

    // AI Logic (Keyword Matching)
    setTimeout(() => {
        let response = "I'm not sure about that.";
        
        if (text.includes("job") || text.includes("work") || text.includes("jobs") || text.includes("openings") || text.includes("vacancies") || text.includes("positions") || text.includes("career") || text.includes("opportunities") || text.includes("hiring") || text.includes("recruitment") || text.includes("employment") || text.includes("job board") || text.includes("job listings") || text.includes("job opportunities") || text.includes("job openings")) {
            response = "Sure! Redirecting you to our Job Board...";
            setTimeout(() => window.location.href = "findJobs.html", 1500); // Redirects to job board page
        } 
        else if (text.includes("home") || text.includes("main") || text.includes("homepage") || text.includes("start") || text.includes("welcome") || text.includes("landing")) {
            response = "Heading back to the homepage...";
            setTimeout(() => window.location.href = "index.html", 1500);
        }
        else if (text.includes("login") || text.includes("sign in") || text.includes("register") || text.includes("sign up") || text.includes("account")) {
            response = "Let's look at the joining section...";
            setTimeout(() => window.location.href = "signup.html", 1500); // Redirects to signup page
        }
        else if(text.includes("share price") || text.includes("stock price") || text.includes("current price") || text.includes("price of shares") || text.includes("stock market price") || text.includes("share value") || text.includes("current stock price") || text.includes("latest share price") || text.includes("stock value") || text.includes("share price today") || text.includes("share market") || text.includes("current share price") || text.includes("current stock value") || text.includes("latest stock price") || text.includes("latest share value") || text.includes("stock price now") || text.includes("share price now")) {
            response = "Let me fetch the page where you can access share prices...";
            setTimeout(() => window.location.href = "findJobs.html", 1500); // Redirects to share price page
        }

        body.innerHTML += `<div class="bot-msg">${response}</div>`;
        body.scrollTop = body.scrollHeight; // Scroll to bottom
    }, 600);
}