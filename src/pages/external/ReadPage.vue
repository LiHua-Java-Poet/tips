<template>
    <div>
        <div class="reader-container">
            <div class="sidebar">
                <h5 class="mb-3">目录</h5>
                <div id="toc-container"></div>
            </div>
            <div class="content-area">
                <div class="content" id="content">
                    <h1 id="chapter1">第一章：富文本阅读器介绍</h1>
                    <p>这是一个简洁的富文本阅读器实现，支持目录导航和内容显示。</p>

                    <h2 id="section1-1">1.1 功能特点</h2>
                    <p>本阅读器具有以下特点：</p>
                    <ul>
                        <li>简洁的界面设计</li>
                        <li>自动生成目录结构</li>
                        <li>响应式布局，适应不同设备</li>
                        <li>目录导航功能</li>
                    </ul>

                    <h2 id="section1-2">1.2 使用方法</h2>
                    <p>将富文本内容插入到阅读器中，系统会自动解析标题生成目录。</p>

                    <h1 id="chapter2">第二章：高级功能</h1>
                    <p>阅读器还支持一些高级功能。</p>

                    <h2 id="section2-1">2.1 搜索功能</h2>
                    <p>可以通过顶部搜索框搜索内容。</p>

                    <h3 id="subsection2-1-1">2.1.1 搜索实现</h3>
                    <p>搜索功能使用JavaScript实现，可以高亮显示匹配结果。</p>

                    <h2 id="section2-2">2.2 阅读进度</h2>
                    <p>系统会记录您的阅读进度。</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'readPage',
    data() {
        return {

        }
    },
    created() {
        // 获取查询参数
        const queryString = window.location.hash.split('?')[1]; // type=pdf&id=123
        const params = new URLSearchParams(queryString);
        console.log(params.get('documentId')); // pdf
    }
}

</script>

<style scoped>
.reader-container {
    display: flex;
    height: calc(100vh - 56px);
    overflow: hidden;
}

.sidebar {
    width: 150px;
    background-color: #fff;
    border-right: 1px solid #dee2e6;
    overflow-y: auto;
    padding: 15px;
}

.content-area {
    flex: 1;
    overflow-y: auto;
    padding: 30px;
    background-color: #fff;
}

.toc-item {
    padding: 5px 0;
    cursor: pointer;
    border-radius: 4px;
    padding-left: 10px;
    transition: all 0.2s;
}

.toc-item:hover {
    background-color: #f1f1f1;
}

.toc-item.level-1 {
    font-weight: bold;
    margin-top: 10px;
}

.toc-item.level-2 {
    padding-left: 20px;
    font-size: 0.95em;
}

.toc-item.level-3 {
    padding-left: 30px;
    font-size: 0.9em;
    color: #6c757d;
}

.toc-item.active {
    background-color: #e9ecef;
    color: #0d6efd;
}

.content {
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.6;
}

.content img {
    max-width: 100%;
    height: auto;
}

.content h1,
.content h2,
.content h3 {
    margin-top: 1.5em;
    margin-bottom: 0.8em;
    padding-bottom: 0.3em;
    border-bottom: 1px solid #eee;
}

.header {
    padding: 10px;
    border-bottom: 1px solid #dee2e6;
    background-color: #f8f9fa;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.search-box {
    width: 200px;
}

.highlight {
    background-color: yellow;
    font-weight: bold;
}
</style>