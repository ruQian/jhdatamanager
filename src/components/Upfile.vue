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
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="filename" label="文件名称" width="180"></el-table-column>
                <el-table-column prop="url" label="存放地址"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-view"
                            @click="handleView(scope.$index, scope.row)"
                        >查看</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-upload"
                            @click="handleUpload( )"
                        >上传</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'basetable',
    data() {
        return {
            tableData: [],
        };
    },
    created() {
        var filename = this.$route.query.filename;
        var url = this.$route.query.url;

        //this.tableData = new Array();
        var d1 = new Object;
        d1["filename"] = filename;
        d1["url"] = url;
        this.tableData[0] = d1;
        console.log(this.tableData);
        //this.getData();
    },
    methods: {
        handleView(index, row)
        {
            console.log(index);
            console.log(row);
        },
        handleUpload()
        {
            console.log("上传文件");
            this.$router.push({path:"/upload"});
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
