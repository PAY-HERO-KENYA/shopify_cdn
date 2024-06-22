// paymentStatusSDK.js
(function(window, document) {
    // Load SweetAlert2
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@10";
    script.onload = init;
    document.head.appendChild(script);

    function init() {
        document.addEventListener('DOMContentLoaded', function() {
            // Show the loading message using SweetAlert2
            Swal.fire({
                title: 'Loading...',
                text: 'Please wait while we check the status of your payment.',
                allowEscapeKey: false,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            var checkFinStatus = setInterval(function() {
                // Get the fin_status object from transactions
                var fin_status = window.fin_status || '';
                // Get the gateway object from transactions
                var gateway = window.gateway || '';

                // Check if the fin_status is not blank
                if (fin_status !== "") {
                    // Hide the loading message
                    Swal.close();

                    // Stop checking for fin_status
                    clearInterval(checkFinStatus);

                    // Check if the order status is 'pending'
                    if (fin_status === "pending") {
                        //SPS_STORE_ACCOUNT_NUMBER: Provide the account number you received when you registered your shopify store on payhero sps
                        let SPS_STORE_ACCOUNT_NUMBER = "1738";
                        // If the gateway is MPESA show MPESA payment button
                        if (gateway === 'MPESA') {
                            Shopify.Checkout.OrderStatus.addContentBox(
                                '<h2><b>Lipa Na MPESA Online</b></h2>',
                                '<p>Click on the following button to make your payment:<br><a href="https://payherokenya.com/sps/portal/app/shopify_checkout?account_number=' + SPS_STORE_ACCOUNT_NUMBER + '&order_id=' + window.order_id + '" class="button"><b>Pay Now</b></a></p>'
                            );
                        }
                        //If the gateway is Paypal/Card show Paypal/Card payment button
                        if (gateway === 'Paypal/Card') {
                            Shopify.Checkout.OrderStatus.addContentBox(
                                '<h2><b>Pay With PayPal/Card</b></h2>',
                                '<p>Click on the following button to make your payment:<br><a href="https://payherokenya.com/sps/portal/app/shopify_paypal_checkout.php?account_number=' + SPS_STORE_ACCOUNT_NUMBER + '&order_id=' + window.order_id + '" class="button"><b>Pay Now</b></a></p>'
                            );
                        }
                    } else if (fin_status === "paid") {
                        // If the order is paid, show a message that payment has been received
                        Shopify.Checkout.OrderStatus.addContentBox(
                            '<h2><b>Payment Received</b></h2>',
                            '<p>Thank you for your payment.</p>'
                        );
                    }
                }
            }, 1000); // Check fin_status every second

            // Show the refresh alert using SweetAlert2 after 3 seconds
            setTimeout(function() {
                if (window.fin_status === '') {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Oops...',
                        text: 'Something went wrong. Please refresh the page and try again.',
                        confirmButtonText: 'Refresh',
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                        showCancelButton: false,
                        showCloseButton: false
                    }).then((result) => {
                        location.reload();
                    });
                }
            }, 3000);
        });
    }
})(window, document);

// Add the button styles
const style = document.createElement('style');
style.textContent = `
  .button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #2ec56e;
    color: white;
    border-radius: 5px;
    text-decoration: none;
    font-size: 16px;
    margin-top: 10px;
  }
  .button:hover {
    background-color: #1e2a3a;
    color: #2ec56e;
    cursor: pointer;
  }
`;
document.head.appendChild(style);
