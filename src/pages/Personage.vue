<template>
    <div class="user-profile">
        <div class="card">
            <div class="card-header">
                <img :src="user.headImage" alt="头像" class="avatar" />
                <div class="user-info">
                    <h2>{{ user.user_name || user.name }}</h2>
                    <p class="account">账号: {{ user.account }}</p>
                    <p class="phone">手机号: {{ user.phone }}</p>
                    <badge :class="statusClass">{{ statusText }}</badge>
                </div>
            </div>
            <div class="card-content">
                <p>类型: {{ user.type === 2 ? '管理员' : '普通用户' }}</p>
                <p>创建时间: {{ formatDate(user.createTime) }}</p>
            </div>
            <div class="actions">
                <button class="btn edit" @click="editUser">编辑</button>
                <button class="btn delete" @click="deleteUser">删除</button>
            </div>
        </div>
    </div>
</template>

<script>
import formatDate from '@/utils/navigator'
export default {
    name: "personagePage",
    data() {
        return {
        }
    },
    computed: {
        statusText() {
            return this.user.status === 1 ? '正常' : '停用';
        },
        user() {
            return this.$store.getters.userInfo;
        },
        statusClass() {
            return this.user.status === 1 ? 'badge-success' : 'badge-danger';
        }
    },
    methods: {
        formatDate,
        editUser() {
            alert('编辑用户信息');
        },
        deleteUser() {
            alert('删除用户');
        }
    }
}
</script>

<style scoped>
.user-profile {
    display: flex;
    justify-content: center;
    padding: 20px;
}

.card {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
    padding: 20px;
}

.card-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
}

.avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 16px;
}

.user-info h2 {
    margin: 0;
    font-size: 20px;
}

.badge-success {
    background: #4caf50;
    color: #fff;
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 12px;
}

.badge-danger {
    background: #f44336;
    color: #fff;
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 12px;
}

.actions {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.btn {
    padding: 8px 12px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.edit {
    background: #2196f3;
    color: #fff;
}

.delete {
    background: #f44336;
    color: #fff;
}
</style>
