class MockEmailProvider {
    constructor(name, failureRate = 0) {
        this.name = name;
        this.failureRate = failureRate; // Simulates failure rate (0 = always succeed, 1 = always fail)
    }

    /**
     * Simulates sending an email.
     */
    async sendEmail(to, subject, body) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const isSuccess = Math.random() > this.failureRate;
                if (isSuccess) {
                    console.log(`${this.name}: Email sent successfully`);
                    resolve(`${this.name}: Email sent`);
                } else {
                    console.log(`${this.name}: Failed to send email`);
                    reject(new Error(`${this.name}: Failed to send email`));
                }
            }, 500); // Simulate processing delay
        });
    }
}

module.exports = MockEmailProvider;
