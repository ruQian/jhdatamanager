<template>
    <div>
        <!--div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 标注详细信息
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div!-->
        <div class="container">
            <input
                accept="application/pdf"
                ref="input"
                type="file"
                @change="onInputChange"
                style="display:none"
            />
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="filename" label="文件名称" width="180"></el-table-column>
                <el-table-column label="预览" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-view"
                            @click="handleView(scope.$index, scope.row)"
                            :disabled=!tableData[scope.$index].bdeleteBtnShow
                            v-if=tableData[scope.$index].bViewBtnShow
                        >查看</el-button>
                        <progress-bar
                            class="progress-bar"
                            :options="options"
                            :value=tableData[scope.$index].downvalue
                            v-if=tableData[scope.$index].bDownProcessShow
                        ></progress-bar>
                    </template>
                </el-table-column>
                <el-table-column label="管理" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button 
                            type="text"
                            icon="el-icon-upload"  
                            @click="handleNewUpload(scope.$index, scope.row)"
                            v-if=tableData[scope.$index].bUpBtnShow
                        >{{tableData[scope.$index].uploadBtnText}}</el-button>
                        <progress-bar
                            class="progress-bar"
                            :options="options"
                            :value=tableData[scope.$index].value
                            v-if=tableData[scope.$index].bUpProcessShow
                        ></progress-bar>
                        <el-button 
                            type="text"
                            icon="el-icon-delete"  
                            @click="handleDelete(scope.$index, scope.row)"
                            v-if=tableData[scope.$index].bdeleteBtnShow
                        >删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="url" label="存放地址"></el-table-column>
            </el-table>
        </div>
        
        <div class="crop-demo">
            <img src="http://www.ylhzzy.top:8828/public/test/unity.jpg"  class="pre-img"/>
        </div>
    </div>
</template>

<script>  
import {downloadFile, uploadFile, uploadFeatureApi, getFeatureByUid} from '../api/index';
import FormData from 'form-data';
export default {
    name: 'basetable',
    data() {
        return {
            uid:null,
            featureData:null,
            uploadrow:-1,
            tableData: [],
            options: {
                text: {
                    color: '#FFFFFF',
                    shadowEnable: true,
                    shadowColor: '#000000',
                    fontSize: 10,
                    fontFamily: 'Helvetica',
                    dynamicPosition: false,
                    hideText: false
                },
                progress: {
                    color: '#2dbd2d',
                    backgroundColor: '#333333'
                },
                layout: {
                    height: 12,
                    width: 100,
                    verticalTextAlign: 70,
                    horizontalTextAlign: 45,
                    zeroOffset: 0,
                    strokeWidth: 100,
                    progressPadding: 0,
                    type: 'line'
                }
            },

        };
    },
    created() {
        this.uid = this.$route.query.uid;
        //根据uid 获取数据
        var paramsData = new Object();
        paramsData["data"] = {"uid":this.uid};
        getFeatureByUid(paramsData).then(res => {
                console.log(res);
                this.featureData = res;
                var file1 = this.featureData.file1;
                var file2 = this.featureData.file2;
                var file3 = this.featureData.file3;
                //this.tableData = new Array();
                var d1 = new Object;
                d1["filename"] = "文件1";
                d1["url"] = file1;
                d1["value"] = 0;
                d1["bUpProcessShow"] = false;
                d1["downvalue"] = 0;
                d1["bDownProcessShow"] = false;
                d1["bUpBtnShow"] = true;
                d1["bdeleteBtnShow"] = d1["url"] != "";
                d1["bViewBtnShow"] = true;
                d1["uploadBtnText"] = d1["url"] == ""?"上传":"更新";
                this.tableData.push(d1);
                var d2 = new Object;
                d2["filename"] = "文件2";
                d2["url"] = file2;
                d2["value"] = 0;
                d2["bUpProcessShow"] =  false;
                d2["downvalue"] = 0;
                d2["bDownProcessShow"] = false;
                d2["bUpBtnShow"] = true;
                d2["bdeleteBtnShow"] = d2["url"] != "";
                d2["bViewBtnShow"] = true;
                d2["uploadBtnText"] = d2["url"] == ""?"上传":"更新";
                this.tableData.push(d2);
                var d3 = new Object;
                d3["filename"] = "文件3";
                d3["url"] = file3;
                d3["value"] = 0;
                d3["bUpProcessShow"] = false;
                d3["downvalue"] = 0;
                d3["bDownProcessShow"] =  false;
                d3["bUpBtnShow"] = true;
                d3["bdeleteBtnShow"] = d3["url"] != "";
                d3["bViewBtnShow"] = true;
                d3["uploadBtnText"] = d3["url"] == ""?"上传":"更新";
                this.tableData.push(d3);
                console.log(this.tableData);
                //this.getData();
            }
        )
    },
    methods: {
        handleView(index, row)
        {
            this.showDownProcess(index, true);
            console.log(index);
            console.log(row);
            let url = row.url;//.replace("/", "//");
            var paramsData = new Object();
            paramsData['url'] = url;
            paramsData["onDownloadProgress"] = this.onDownloadProgress.bind(this, index);
            downloadFile(paramsData).then(res => {
                        console.log(res);
                        //this.savaFile(res);
                    });
            /*
            console.log(url);
            if(url != "")
            {
                window.location.href = url; 
                window.open(); 
            }
            */
        },
        savaFile(data) {
            // 文件导出
            if (!data) {
            return
            }
            let url = window.URL.createObjectURL(new Blob([data]));
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.setAttribute('download', '1.pdf');
            document.body.appendChild(link);
            link.click()
        },
        handleDelete(index)
        {
            if(index > -1 && index < 3)
            {
                if(index == 0)
                {
                    this.featureData.file1 = "";
                }
                if(index == 1)
                {
                    this.featureData.file2 = "";
                }
                if(index == 2)
                {
                    this.featureData.file3 = "";
                }
                console.log(this.featureData );
                var paramsData = new Object();
                paramsData["data"] = this.featureData;
                uploadFeatureApi(paramsData).then(res => {
                            console.log(res);
                            if(res['status'] != null && res['status'] == 200)
                            {
                                this.tableData[index].url = "";
                                this.updateBtmText(index);
                            }
                    }
                )
            }
        },
        normalizeFiles (rawFile) {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            console.log(rawFile);
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        const file = {
            name: rawFile.name,
            size: rawFile.size,
            type: rawFile.type,
            percent: 0,
            uid: Date.now(),
            status: 'init', // value list: init pending success failure
            raw: rawFile
        };
        return file;
        },
        startUpload(rawFile, index){
            const file = this.normalizeFiles(rawFile);
            var paramsData = new Object();
            const formData = new FormData();
            formData.append("file", file.raw);
            console.log(formData);
            paramsData["data"] = formData;
            paramsData["OnUploadProgress"] = this.onUploadProgress.bind(this, this.uploadrow);
            //
            uploadFile(paramsData).then(res => {
                console.log(res);
                if(res['code'] != null && res['code'] == 200)
                {
                    var filePath = res.data.path;
                    if(index == 0)
                    {
                        this.featureData.file1 = filePath;
                    }
                    if(index == 1)
                    {
                        this.featureData.file2 = filePath;
                    }
                    if(index == 2)
                    {
                        this.featureData.file3 = filePath;
                    }
                    var paramsData = new Object();
                    paramsData['data'] = this.featureData;
                    //上传文件路径到数据库
                    uploadFeatureApi(paramsData).then(res => {
                            console.log(res);
                            if(res['status'] == 200)
                            {
                                console.log(filePath);
                                this.tableData[index].url = filePath;
                                this.updateBtmText(index);
                            }
                        }
                    )
                }
            });
        },
        onInputChange (e) {
            console.log(e.target.files[0]);
            this.showProcess(this.uploadrow, true);
            const rawFiles = Array.from(e.target.files);
            if(rawFiles.length > 0)
            {
                this.startUpload(rawFiles[0], this.uploadrow);
            }
            this.$refs.input.value = '';
        },
        handleNewUpload(index, row)
        {
            this.uploadrow = index;
            //上传文件
            this.$refs.input.click();
        },
        onUploadProgress (index, progress) {
            console.log(progress);
            var td = this.tableData[index];
            if(typeof(td) != "undefined")
            {
                td.value = parseInt((progress.loaded/progress.total)*100);
                if(progress.loaded == progress.total)
                {
                    this.showProcess(index, false);
                }
            }
        },
        onDownloadProgress (index, progress) {
            console.log(progress);
            var td = this.tableData[index];
            if(typeof(td) != "undefined")
            {
                td.downvalue = parseInt((progress.loaded/progress.total)*100);
                if(progress.loaded == progress.total)
                {
                    this.showDownProcess(index, false);
                }
            }
        },
        showProcess(index, bShow)
        {
            var td = this.tableData[index];
            if(typeof(td) != "undefined")
            {
                if(bShow)
                {
                    if(td["bUpBtnShow"] == true)
                    {
                        td["bUpProcessShow"] = true;
                        td["bdeleteBtnShow"] = false;
                        td["bUpBtnShow"] = false;
                    }
                }
                else
                {
                    if(td["bUpBtnShow"] == false)
                    {
                        td["bUpProcessShow"] =  false;
                        td["bdeleteBtnShow"] = true;
                        td["bUpBtnShow"] = true;
                    }
                }
            }
        },
        showDownProcess(index, bShow)
        {
            var td = this.tableData[index];
            if(typeof(td) != "undefined")
            {
                if(bShow)
                {
                    if(td["bViewBtnShow"] == true)
                    {
                        td["bDownProcessShow"] = true;
                        td["bViewBtnShow"] = false;
                    }
                }
                else
                {
                    if(td["bViewBtnShow"] == false)
                    {
                        td["bDownProcessShow"] = false;
                        td["bViewBtnShow"] = true;
                    }
                }
            }
        },
        updateBtmText(index)
        {
            var td = this.tableData[index];
            if(typeof(td) != "undefined")
            {
                td["bdeleteBtnShow"] = td["url"] != "";
                td["uploadBtnText"] = td["url"] == ""?"上传":"更新";
            }
        },
        viewBtnEnable()
        {
            return false;
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
.mongolia{
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}
.progress-bar {
  display:inline-block;
  width: 100px;
  line-height: 20px;
}
.pre-img{   
    width: 100px;
    height: 100px;
    background: #f8f8f8;
    border: 1px solid #eee;
    border-radius: 5px;
}
.crop-demo{
    width: 200px;
    height: 200px;
    display: flex;
    align-items: flex-end;
}
</style>
