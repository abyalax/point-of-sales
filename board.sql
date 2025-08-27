SELECT
    p.name AS product_name,
    COALESCE(
        AVG(
            CASE
                WHEN ti.discount > 0 THEN ti.quantity
            END
        ),
        0
    ) AS avg_qty_with_discount,
    COALESCE(
        AVG(
            CASE
                WHEN ti.discount = 0 THEN ti.quantity
            END
        ),
        0
    ) AS avg_qty_without_discount
FROM
    transaction_items ti
    JOIN products p ON p.barcode = ti.barcode
    JOIN transactions t ON t.id = ti.transaction_id
WHERE
    t.created_at BETWEEN '2024-01-01' AND '2024-12-30' -- periode
GROUP BY
    p.name
ORDER BY
    (COALESCE(SUM(ti.quantity), 0)) DESC -- ranking produk paling berpengaruh
LIMIT
    20;

-- top 10 produk
