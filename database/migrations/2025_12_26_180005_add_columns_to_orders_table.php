<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('shipping_address_id')->nullable()->after('status')
                ->constrained('addresses')->nullOnDelete();
            $table->string('payment_method')->default('card')->after('shipping_address_id');
            $table->text('notes')->nullable()->after('payment_method');
            $table->timestamp('cancelled_at')->nullable()->after('notes');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['shipping_address_id']);
            $table->dropColumn(['shipping_address_id', 'payment_method', 'notes', 'cancelled_at']);
        });
    }
};
