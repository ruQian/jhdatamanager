<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 标注详细信息
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
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
                        >查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="管理" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button 
                            type="text"
                            icon="el-icon-upload"  
                            @click="handleNewUpload(scope.$index, scope.row)"
                        >新上传</el-button>
                        <el-button 
                            type="text"
                            icon="el-icon-delete"  
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="url" label="存放地址"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>  
import {uploadFile, uploadFeatureApi, getFeatureByUid} from '../api/index';
import FormData from 'form-data';
export default {
    name: 'basetable',
    data() {
        return {
            uid:null,
            featureData:null,
            uploadrow:-1,
            tableData: [],
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
                this.tableData.push(d1);
                var d2 = new Object;
                d2["filename"] = "文件2";
                d2["url"] = file2;
                this.tableData.push(d2);
                var d3 = new Object;
                d3["filename"] = "文件3";
                d3["url"] = file3;
                this.tableData.push(d3);
                console.log(this.tableData);
                //this.getData();
            }
        )
    },
    methods: {
        handleView(index, row)
        {
            console.log(index);
            console.log(row);
            let url = row.url;//.replace("/", "//");
            console.log(url);
            if(url != "")
            {
                window.location.href = url; 
                window.open(); 
            }
            /*
            let routeData = this.$router.resolve({
                    path: "http://www.baidu.com"
                   });
                   window.open(routeData.href, '_blank');
            window.open(routeData.href, '_blank');
            */
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
                            }
                    }
                )
            }
        },
        normalizeFiles (rawFile) {
            console.log(rawFile);
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
        startUpload(rawFile){
            const file = this.normalizeFiles(rawFile);
            
            var paramsData = new Object();
            const formData = new FormData();
            formData.append("file", file.raw);
            console.log(formData);
            paramsData["data"] = formData;
            paramsData["OnUploadProgress"] = this.onUploadProgress;
            //
            uploadFile(paramsData).then(res => {
                console.log(res);
            });


        },
        onInputChange (e) {
            console.log(e);
            const rawFiles = Array.from(e.target.files);
            if(rawFiles.length > 0)
            {
                this.startUpload(rawFiles[0]);
            }
        },
        handleNewUpload(index, row)
        {
            //上传文件
            this.$refs.input.click();
        },
        handleUpload(index)
        {
            console.log("上传文件");
            console.log(index);
            this.uploadrow = index;
        },
        onUploadProgress (progress) {
            console.log(progress);
        },
        onChange (file) 
        {
            //可以得到上传文件进度
            //console.log('file', file, fileList);
            console.log(file);
            console.log(file.percent);
        },
        onSuccess(res)
        {
            console.log(res);
            var index = this.uploadrow;
            if(index > -1 && index < 3)
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
                console.log(this.featureData );
                var paramsData = new Object();
                paramsData["data"] = this.featureData;
                uploadFeatureApi(paramsData).then(res => {
                            console.log(res);
                            if(res['status'] != null && res['status'] == 200)
                            {
                                this.tableData[this.uploadrow].url = filePath;
                            }
                    }
                )
            }
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
</style>
