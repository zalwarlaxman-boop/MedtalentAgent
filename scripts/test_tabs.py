from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://127.0.0.1:8081')
    page.wait_for_load_state('networkidle')

    print("--- 开始测试 Tab 切换可见性 ---")
    
    # 获取所有的导航项
    nav_items = page.locator('.nav-item').all()
    
    for i, item in enumerate(nav_items):
        target_id = item.get_attribute('data-target')
        item_text = item.inner_text()
        
        # 点击该导航
        item.click()
        page.wait_for_timeout(500)  # 等待动画和DOM更新
        
        # 检查对应的 Tab 是否可见
        tab_content = page.locator(f'#{target_id}')
        is_visible = tab_content.is_visible()
        
        print(f"点击了 '{item_text}' ({target_id}): 内容可见状态 -> {is_visible}")

    browser.close()