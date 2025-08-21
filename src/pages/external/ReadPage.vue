<template>
    <div>
        <div class="reader-container">
            <!-- 目录栏 -->
            <div :class="['sidebar', { collapsed: isCollapsed }]">
                <div class="sidebar-header">
                    <h5 v-if="!isCollapsed">目录</h5>
                    <button class="toggle-btn" @click="toggleSidebar">
                        <i :class="isCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
                    </button>
                </div>

                <div class="collapsed-toc-hint">阅读目录</div>

                <div id="toc-container" v-if="!isCollapsed">
                    <div v-for="(item, index) in tocList" :key="index"
                        :class="['toc-item', `level-${item.level}`, { active: activeId === item.id }]"
                        @click="scrollTo(item.id)">
                        {{ item.text }}
                    </div>
                </div>
            </div>

            <!-- 内容区 -->
            <div class="content-area" ref="contentArea">
                <button class="toggle-btn mobile-toggle" @click="toggleSidebar" v-if="isCollapsed">
                    <i class="fas fa-list"></i>
                </button>
                <div class="content" id="content" v-html="htmlContent"></div>
                <div style="height: 500px;"></div>
            </div>
        </div>
    </div>
</template>


<script>
import { getFileInfo } from "@/api/file";

export default {
    name: "readPage",
    data() {
        return {
            tocList: [],
            activeId: null,
            htmlContent: null,
            observer: null,
            isCollapsed: false
        };
    },
    mounted() {
        // 监听内容区域滚动
        this.$refs.contentArea.addEventListener("scroll", this.onScroll);

        // 使用MutationObserver监听DOM变化
        this.observer = new MutationObserver(this.buildToc);
        this.observer.observe(this.$refs.contentArea, {
            childList: true,
            subtree: true
        });

        // 响应式处理：小屏幕下默认折叠侧边栏
        if (window.innerWidth < 992) {
            this.isCollapsed = true;
        }
    },
    beforeDestroy() {
        this.$refs.contentArea.removeEventListener("scroll", this.onScroll);
        if (this.observer) this.observer.disconnect();
    },
    methods: {
        // 切换侧边栏
        toggleSidebar() {
            this.isCollapsed = !this.isCollapsed;
        },
        // 构建目录
        buildToc() {
            const contentElement = this.$el.querySelector("#content");
            if (!contentElement) return;

            const headings = contentElement.querySelectorAll("h1, h2, h3");
            this.tocList = Array.from(headings).map((h, index) => {
                // 确保标题有ID
                if (!h.id) {
                    h.id = `heading-${index}`;
                }
                return {
                    id: h.id,
                    text: h.innerText,
                    level: Number(h.tagName[1]) // H1 -> 1, H2 -> 2
                };
            });
        },
        // 滚动到对应标题
        scrollTo(id) {
            const target = document.getElementById(id);
            const container = this.$refs.contentArea;
            if (target && container) {
                // 计算目标在容器中的相对位置
                const targetTop = target.getBoundingClientRect().top + container.scrollTop;
                const containerTop = container.getBoundingClientRect().top;

                container.scrollTo({
                    top: targetTop - containerTop - 20, // 留点间距
                    behavior: "smooth"
                });
            }

            // 移动设备上滚动后自动折叠侧边栏
            if (window.innerWidth < 992) {
                this.isCollapsed = true;
            }
        },
        // 滚动监听，高亮目录
        onScroll() {
            const container = this.$refs.contentArea;
            const scrollTop = container.scrollTop;
            let current = null;

            for (const item of this.tocList) {
                const el = document.getElementById(item.id);
                if (el) {
                    // 计算元素相对于内容区域的位置
                    const elTop = el.offsetTop;
                    if (elTop - 30 <= scrollTop) {
                        current = item.id;
                    }
                }
            }

            this.activeId = current;
        }
    },
    created() {
        // 获取查询参数
        const queryString = window.location.hash.split('?')[1];
        const params = new URLSearchParams(queryString);
        // 获取到文档内容
        getFileInfo({ id: params.get('documentId') }).then(res => {
            this.htmlContent = res.data.data.content;

            this.$nextTick(() => {
                // DOM 更新完再构建目录
                this.buildToc();
            });
        });
    },
};
</script>



<style>
.reader-container {
    display: flex;
    width: 100%;
    height: 100vh;
    background: white;
    overflow: hidden;
}

/* 侧边栏样式 */
.sidebar {
    width: 280px;
    padding: 25px 20px;
    background: #2c3e50;
    color: #ecf0f1;
    height: 100vh;
    overflow-y: auto;
    position: relative;
    transition: all 0.3s ease;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    z-index: 10;
}

.sidebar.collapsed {
    width: 60px;
    padding: 25px 10px;
}

.sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #3498db;
}

.sidebar h5 {
    color: #3498db;
    font-weight: 600;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
}

.toggle-btn {
    background: #3498db;
    color: white;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.toggle-btn:hover {
    background: #2980b9;
    transform: scale(1.05);
}

.toc-item {
    padding: 10px 15px;
    margin: 8px 0;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.toc-item:hover {
    background: #34495e;
}

.toc-item.active {
    background: #3498db;
    color: white;
    font-weight: 500;
}

.level-1 {
    font-weight: 600;
    font-size: 1.1em;
    padding-left: 15px;
}

.level-2 {
    padding-left: 30px;
    font-size: 1em;
}

.level-3 {
    padding-left: 45px;
    font-size: 0.95em;
    color: #bdc3c7;
}

/* 内容区域样式 */
.content-area {
    flex: 1;
    padding: 30px;
    height: 100vh;
    overflow-y: auto;
    background: #fff;
    transition: all 0.3s ease;
}

.content {
    line-height: 1.8;
    max-width: 800px;
    margin: 0 auto;
}

.content h1 {
    color: #2c3e50;
    border-bottom: 2px solid #3498db;
    padding-bottom: 10px;
    margin-top: 30px;
}

.content h2 {
    color: #34495e;
    margin-top: 25px;
    padding-left: 10px;
    border-left: 4px solid #3498db;
}

.content h3 {
    color: #7f8c8d;
    margin-top: 20px;
}

.content p {
    margin-bottom: 20px;
    text-align: justify;
}

/* 折叠状态下的目录提示 */
.collapsed-toc-hint {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(90deg);
    white-space: nowrap;
    font-weight: 600;
    color: #3498db;
    display: none;
}

.sidebar.collapsed .collapsed-toc-hint {
    display: block;
}

/* 响应式设计 */
@media (max-width: 992px) {
    .sidebar {
        position: absolute;
        left: 0;
        transform: translateX(0);
    }

    .sidebar.collapsed {
        transform: translateX(-100%);
        width: 280px;
    }

    .toggle-btn.mobile-toggle {
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 100;
        display: block;
    }
}
</style>