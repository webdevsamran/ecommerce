<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Low Stock Alert</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
        .container { background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #1a1a1a; margin-top: 0; }
        .alert-critical { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin-bottom: 20px; border-radius: 0 8px 8px 0; }
        .alert-warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 20px; border-radius: 0 8px 8px 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #f8f9fa; padding: 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #e9ecef; }
        td { padding: 12px; border-bottom: 1px solid #e9ecef; }
        .critical { color: #dc2626; font-weight: bold; }
        .warning { color: #d97706; font-weight: bold; }
        .stock-badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .stock-critical { background: #fee2e2; color: #dc2626; }
        .stock-warning { background: #fef3c7; color: #d97706; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚨 Low Stock Alert</h1>
        
        @if($criticalCount > 0)
        <div class="alert-critical">
            <strong>Critical:</strong> {{ $criticalCount }} products have critically low stock (≤{{ $criticalThreshold }} units) and need immediate attention!
        </div>
        @else
        <div class="alert-warning">
            <strong>Warning:</strong> {{ $products->count() }} products are running low on stock (≤{{ $warningThreshold }} units).
        </div>
        @endif

        <p>The following products require restocking:</p>

        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Stock</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($products->sortBy('stock_quantity') as $product)
                <tr>
                    <td>{{ $product->name }}</td>
                    <td>{{ $product->sku ?? 'N/A' }}</td>
                    <td class="{{ $product->stock_quantity <= $criticalThreshold ? 'critical' : 'warning' }}">
                        {{ $product->stock_quantity }}
                    </td>
                    <td>
                        @if($product->stock_quantity <= $criticalThreshold)
                            <span class="stock-badge stock-critical">Critical</span>
                        @else
                            <span class="stock-badge stock-warning">Low</span>
                        @endif
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="footer">
            <p>This is an automated notification from TechStore.</p>
            <p>
                <strong>Thresholds:</strong><br>
                Warning: ≤{{ $warningThreshold }} units | Critical: ≤{{ $criticalThreshold }} units
            </p>
        </div>
    </div>
</body>
</html>
