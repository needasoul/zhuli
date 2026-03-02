<?php
// 测试助力功能API接口

// 基础配置
define('API_BASE_URL', 'https://zl.nankeyimeng.xyz/api');
define('TEST_TOKEN', 'your_test_token_here'); // 需要替换为实际的测试token

// 测试函数
function testApi($endpoint, $data = [], $method = 'POST') {
    $url = API_BASE_URL . '/' . $endpoint;
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, $method == 'POST');
    
    if ($method == 'POST') {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'token: ' . TEST_TOKEN
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'code' => $httpCode,
        'data' => json_decode($response, true)
    ];
}

echo "=== 助力功能API接口测试 ===\n\n";

// 1. 测试获取助力任务列表
echo "1. 测试获取助力任务列表...\n";
$result = testApi('boost/tasks', [
    'page' => 1,
    'limit' => 10,
    'category_id' => 0,
    'status' => 'active'
]);
echo "状态码: " . $result['code'] . "\n";
echo "返回数据: " . json_encode($result['data'], JSON_PRETTY_PRINT) . "\n\n";

// 2. 测试获取助力任务详情
echo "2. 测试获取助力任务详情...\n";
$result = testApi('boost/taskDetail', [
    'id' => 1
]);
echo "状态码: " . $result['code'] . "\n";
echo "返回数据: " . json_encode($result['data'], JSON_PRETTY_PRINT) . "\n\n";

// 3. 测试获取助力分类
echo "3. 测试获取助力分类...\n";
$result = testApi('boost/categories', []);
echo "状态码: " . $result['code'] . "\n";
echo "返回数据: " . json_encode($result['data'], JSON_PRETTY_PRINT) . "\n\n";

// 4. 测试搜索助力任务
echo "4. 测试搜索助力任务...\n";
$result = testApi('boost/search', [
    'keyword' => '京东',
    'page' => 1,
    'limit' => 10
]);
echo "状态码: " . $result['code'] . "\n";
echo "返回数据: " . json_encode($result['data'], JSON_PRETTY_PRINT) . "\n\n";

// 5. 测试获取助力统计
echo "5. 测试获取助力统计...\n";
$result = testApi('boost/stats', []);
echo "状态码: " . $result['code'] . "\n";
echo "返回数据: " . json_encode($result['data'], JSON_PRETTY_PRINT) . "\n\n";

echo "=== 测试完成 ===\n";