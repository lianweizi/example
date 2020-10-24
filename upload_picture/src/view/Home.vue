<template>
  <div class="subPhoto">
    <!-- 顶部 -->
    <div class="row pl-5 pr-5 pt-3 subPhoto-head">
      <!-- 顶部左边 图片显示 轮播图 -->
      <div class="col-lg-8 p-3">
        <div v-if="urls.length<1" class="w-100 h-100 bg-dark text-white text-center">暂无照片</div>
        <div v-else class="w-100">
          <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
            <ol class="carousel-indicators">
              <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
            </ol>
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img :src="urls[0].Url" class="d-block w-100" alt="..." v-if="urls[0]" />
              </div>
              <div class="carousel-item">
                <img :src="urls[1].Url" class="d-block w-100" alt="..." v-if="urls[1]" />
              </div>
              <div class="carousel-item">
                <img :src="urls[2].Url" class="d-block w-100" alt="..." v-if="urls[2]" />
              </div>
            </div>
            <a
              class="carousel-control-prev"
              href="#carouselExampleIndicators"
              role="button"
              data-slide="prev"
            >
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="sr-only">Previous</span>
            </a>
            <a
              class="carousel-control-next"
              href="#carouselExampleIndicators"
              role="button"
              data-slide="next"
            >
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="sr-only">Next</span>
            </a>
          </div>
        </div>
      </div>
      <!-- 顶部右边 图片列表-->
      <div class="col-lg-4 h-100 p-0 border border-warning rounded">
        <div class="progress" v-show="uploadStatus">
          <div
            id="uploadStatus"
            class="progress-bar progress-bar-striped bg-success progress-bar-animated"
            role="progressbar"
            :style="'width:'+uploadStatus"
            aria-valuenow="75"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <button class="btn btn-warning w-100" @click="preUpload">点击上传图片</button>
        <input type="file" id="photoFile" style="display:none" @change="upload" />
        <ul class="list-group">
          <li class="p-0 list-group-item active" v-for="(item,index) in urls" :key="index">
            <button
              type="button"
              class="btn btn-dark w-100"
              data-toggle="modal"
              data-target="#modalL"
              @click="modal(item.Url)"
            >{{item.urlName}}</button>
          </li>
          <li class="list-group-item text-center">照片集 点击可以放大缩小</li>
        </ul>
      </div>
    </div>

    <!-- 模态框 放大缩小 -->
    <div class="modal" id="modalL" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true" @click="restore()">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="modal-body-img" id="scaling">
              <img :src="current_url" alt />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-warning" @click="redAndIncre(-1)">缩小</button>
            <button type="button" class="btn btn-warning" @click="redAndIncre(+1)">放大</button>
            <button type="button" class="btn btn-dark" @click="restore()">重置</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      urls: [],
      current_url: "",
      uploadStatus: ""
    };
  },
  computed: {},
  methods: {
    preUpload() {
      $("#photoFile").click();
      this.uploadStatus = "0%"; //上传进度条-开始
    },
    //上传图片
    upload(e) {
      try {
        var photo = e.target.files[0];
        if (!photo) return;
        this.uploadStatus = "50%"; //dom存有照片
        var formDate = new FormData();
        formDate.append("file", photo);
        this.uploadStatus = "70%"; //照片存入FormDatas对象
        var that = this;
        $.ajax({
          url: "http://localhost:4399/users/upload",
          type: "post",
          data: formDate,
          contentType: false,
          processData: false,
          success(data) {
            that.uploadStatus = "100%";
            that.urls.push(data);
          },
          error(err) {
            //上传失败显示红色
            alert(
              `上传失败，请重新上传,状态码：${err.status} 报错原因：${err.statusText}`
            );
            $("#uploadStatus").removeClass("bg-success").addClass("bg-danger");
          }
        });
      } catch (err) {
           alert(`上传异常${err}`);
            $("#uploadStatus").removeClass("bg-success").addClass("bg-danger");
      }
      setTimeout(() => (this.uploadStatus = ""), 1000);
    },
    modal(url) {
      if (!url) return;
      this.current_url = url;
    },
    //放大缩小
    redAndIncre(num) {
      var width = $("#scaling").width();
      var height = $("#scaling").height();
      var newWidth, newHeight;
      if (num > 0) {
        newWidth = Math.ceil(width * 1.1);
        newHeight = Math.ceil(height * 1.1);
      } else {
        newWidth = Math.ceil(width / 1.1);
        newHeight = Math.ceil(height / 1.1);
      }
      $("#scaling").width(newWidth);
      $("#scaling").height(newHeight);
    },
    //重置
    restore() {
      $("#scaling").width("auto");
      $("#scaling").height("auto");
    }
  }
};
</script>

<style>
.subPhoto-head {
  height: 350px;
}
.carousel-item {
  max-height: 300px;
}

.modal-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body img {
  /* width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%; */
  width: 100%;
  height: 100%;
}
</style>