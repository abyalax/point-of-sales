SELECT
    category,
    name,
    SUM(quantity) AS quantity,
    CASE
        WHEN SUM(final_price * quantity) > 0 THEN ROUND(((SUM(final_price * quantity) - SUM(cost_price * quantity)) / SUM(final_price * quantity)), 4)
        ELSE 0
    END AS margin_percentage,
    SUM(final_price * quantity) AS revenue
FROM
    transaction_items
GROUP BY
    category,
    name
ORDER BY
    category,
    revenue DESC;
