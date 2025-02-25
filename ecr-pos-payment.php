<?php
/**
 * Plugin Name: ECR POS Payment Gateway
 * Plugin URI:  https://yourwebsite.com
 * Description: A custom WooCommerce payment gateway for adding "ECR POS Payment" as a payment method.
 * Version: 1.0.1
 * Author: Chaveen Dias
 * Author URI: https://yourwebsite.com
 * License: GPL2
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

// Register the payment gateway
add_filter('woocommerce_payment_gateways', 'add_ecr_pos_payment_gateway');
function add_ecr_pos_payment_gateway($gateways) {
    $gateways[] = 'WC_ECR_POS_Payment_Gateway';
    return $gateways;
}

// Define the payment gateway class
add_action('plugins_loaded', 'init_ecr_pos_payment_gateway');
function init_ecr_pos_payment_gateway() {
    class WC_ECR_POS_Payment_Gateway extends WC_Payment_Gateway {
        public function __construct() {
            $this->id = 'ecr_pos_payment';
            $this->method_title = __('ECR POS Payment', 'woocommerce');
            $this->method_description = __('Use this payment method for processing transactions through the ECR POS machine.', 'woocommerce');
            $this->has_fields = false;
            
            // Load settings
            $this->init_form_fields();
            $this->init_settings();
            $this->enabled = $this->get_option('enabled');
            $this->title = $this->get_option('title');
            
            add_action('woocommerce_update_options_payment_gateways_' . $this->id, array($this, 'process_admin_options'));
        }

        public function init_form_fields() {
            $this->form_fields = array(
                'enabled' => array(
                    'title' => __('Enable/Disable', 'woocommerce'),
                    'type' => 'checkbox',
                    'label' => __('Enable ECR POS Payment', 'woocommerce'),
                    'default' => 'yes'
                ),
                'title' => array(
                    'title' => __('Title', 'woocommerce'),
                    'type' => 'text',
                    'description' => __('Payment method title displayed at checkout.', 'woocommerce'),
                    'default' => __('ECR POS Payment', 'woocommerce')
                )
            );
        }

        // Process the payment (just mark as on-hold)
        public function process_payment($order_id) {
            $order = wc_get_order($order_id);
            $order->update_status('on-hold', __('Awaiting ECR POS payment', 'woocommerce'));
            return array(
                'result' => 'success',
                'redirect' => $order->get_checkout_order_received_url()
            );
        }
    }
}
?>
