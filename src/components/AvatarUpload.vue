<template>
  <div class="avatar-upload">
    <!-- 头像为空时，显示默认图片，点击整个区域上传 -->
    <el-upload
      v-if="!value"
      class="avatar-uploader"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
      :http-request="uploadRequest"
    >
      <el-image
        :src="defaultImage"
        fit="cover"
        class="avatar"
      ></el-image>
    </el-upload>

    <!-- 有头像时，显示头像 + 悬浮操作 -->
    <div v-else class="avatar-box">
      <el-image
        ref="imagePreview"
        :src="value"
        fit="cover"
        class="avatar"
        :preview-src-list="[value]"
      ></el-image>

      <div class="avatar-mask">
        <el-button
          type="text"
          icon="el-icon-zoom-in"
          @click.stop="previewImage"
        ></el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          circle
          @click.stop="removeAvatar"
        ></el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { post } from "@/api/index";

export default {
  name: "AvatarUpload",
  props: {
    value: { type: String, default: "" },
    defaultImage: { type: String, default: require("@/assets/default-avatar.png") }
  },
  methods: {
    uploadRequest(option) {
      const formData = new FormData();
      formData.append("file", option.file);

      post("oss/uploadFile", formData)
        .then((res) => {
          this.$emit("input", res.data.data);
          option.onSuccess(res);
        })
        .catch((err) => option.onError(err));
    },
    beforeAvatarUpload(file) {
      const isImage = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isImage) {
        this.$message.error("只能上传 JPG/PNG 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("图片大小不能超过 2MB!");
        return false;
      }
      return true;
    },
    removeAvatar() {
      this.$emit("input", "");
    },
    previewImage() {
      const img = this.$refs.imagePreview.$el.querySelector("img");
      if (img) img.click();
    }
  }
};
</script>

<style scoped>
.avatar-upload {
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar-uploader {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  cursor: pointer;
  overflow: hidden;
}
.avatar-box {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
}
.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.3s;
}
.avatar-box:hover .avatar-mask {
  opacity: 1;
}
</style>
