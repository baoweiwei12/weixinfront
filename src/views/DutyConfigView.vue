<template>
    <div>
        <el-input v-model="searchQuery" placeholder="搜索..."
            style="margin-bottom: 20px; margin-right: 10px;width: 300px;" clearable @clear="handleSearch"
            @input="handleSearch" />
        <el-button @click="showAddDialog = true" type="primary" style="margin-bottom: 20px;">添加</el-button>
        <el-switch style="display: block;margin-bottom: 20px;" v-model="showTodayOnly" active-color="#13ce66"
            inactive-color="#ff4949" active-text="今日值日" inactive-text="所有值日">
        </el-switch>

        <el-table :data="paginatedData" style="width: 100%" v-loading="loading">
            <el-table-column label="今日值日" width="100">
                <template slot-scope="scope">
                    <span v-if="isTodayInRange(scope.row.start_time, scope.row.end_time)">✔️</span>
                    <span v-else>❌</span>
                </template>
            </el-table-column>
            <el-table-column prop="group.name" label="群组名"></el-table-column>
            <el-table-column prop="group.wxid" label="群组ID"></el-table-column>
            <el-table-column prop="personnel.nickname" label="值日生微信名"></el-table-column>
            <el-table-column prop="personnel.wechat_id" label="值日生微信号"></el-table-column>
            <el-table-column prop="personnel.wxid" label="值日生ID"></el-table-column>
            <el-table-column prop="personnel.remark" label="值日生备注"></el-table-column>
            <el-table-column prop="start_time" label="开始时间"></el-table-column>
            <el-table-column prop="end_time" label="结束时间"></el-table-column>
            <el-table-column label="操作" width="150">
                <template #default="scope">
                    <el-button @click="deleteDutyPersonnel(scope.row)" type="danger" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="margin-top: 20px; text-align: right;" :current-page="currentPage" :page-size="pageSize"
            layout="total, prev, pager, next" :total="filteredData.length" @current-change="handlePageChange" />
        <el-dialog :visible.sync="showAddDialog" title="添加值日生" width="25%">
            <el-form :model="addForm">
                <el-form-item label="选择群聊" :label-width="formLabelWidth">
                    <el-select v-model="addForm.selectedGroup" placeholder="请选择群聊" filterable="true"
                        @change="loadPersonnelOptions">
                        <el-option v-for="group in groupOptions" :key="group.wxid" :label="group.name"
                            :value="group.wxid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择值日生" :label-width="formLabelWidth">
                    <el-select v-model="addForm.selectedPersonnel" placeholder="请选择值日生" filterable="true">
                        <el-option v-for="person in personnelOptions" :key="person.wxid"
                            :label="`${person.nickname} ${person.remark}`" :value="person.wxid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开始时间" :label-width="formLabelWidth">
                    <el-date-picker v-model="addForm.startTime" type="datetime" placeholder="选择开始时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" :label-width="formLabelWidth">
                    <el-date-picker v-model="addForm.endTime" type="datetime" placeholder="选择结束时间"></el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showAddDialog = false">取消</el-button>
                <el-button type="primary" @click="addDutyPersonnel">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { fetchDutyPersonnelConfig, deleteDutyPersonnelConfig, fetchGroupOptions, fetchPersonnelOptions, addDutyPersonnelConfig } from '@/api';
import { Message } from 'element-ui';
import { isTodayInRange, } from '@/utils';

export default {
    name: 'DutyPersonnelTable',
    data() {
        return {
            loading: true,
            dutyPersonnelData: [],
            showAddDialog: false,
            addForm: {
                selectedGroup: '',
                selectedPersonnel: '',
                startTime: '',
                endTime: '',
            },
            groupOptions: [],
            personnelOptions: [],
            formLabelWidth: '120px',
            searchQuery: '',
            showTodayOnly: false,
            currentPage: 1,
            pageSize: 10,
        };
    },
    computed: {
        filteredData() {

            let filtered = this.dutyPersonnelData;
            if (this.searchQuery) {
                filtered = filtered.filter(item =>
                    item.group.name.includes(this.searchQuery) ||
                    item.group.wxid.includes(this.searchQuery) ||
                    item.personnel.nickname.includes(this.searchQuery) ||
                    item.personnel.wechat_id.includes(this.searchQuery) ||
                    item.personnel.wxid.includes(this.searchQuery) ||
                    item.personnel.remark.includes(this.searchQuery) ||
                    item.start_time.includes(this.searchQuery) ||
                    item.end_time.includes(this.searchQuery)
                );
            }
            if (this.showTodayOnly) {
                filtered = filtered.filter(item => this.isTodayInRange(item.start_time, item.end_time));
            }
            return filtered;
        },
        paginatedData() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = this.currentPage * this.pageSize;
            return this.filteredData.slice(start, end);
        }
    },
    created() {
        this.loadDutyPersonnelData();
        this.loadGroupOptions();
    },
    methods: {
        isTodayInRange(startDate, endDate) {
            return isTodayInRange(startDate, endDate);
        },
        async loadDutyPersonnelData() {
            try {
                this.loading = true;
                const response = await fetchDutyPersonnelConfig();
                this.dutyPersonnelData = response.data;
                this.loading = false;
            } catch (error) {
                console.error('Failed to load duty personnel data:', error);
            }
        },
        async deleteDutyPersonnel(row) {
            try {
                await deleteDutyPersonnelConfig(row.id);
                await this.loadDutyPersonnelData();
                Message.success('删除成功');
            } catch (error) {
                console.error('Failed to delete duty personnel:', error);
            }
        },
        async loadGroupOptions() {
            try {
                const response = await fetchGroupOptions();
                this.groupOptions = response.data;
            } catch (error) {
                console.error('Failed to load group options:', error);
            }
        },
        async loadPersonnelOptions(groupWxid) {
            try {
                const response = await fetchPersonnelOptions(groupWxid);
                this.personnelOptions = response.data;
            } catch (error) {
                console.error('Failed to load personnel options:', error);
            }
        },
        async addDutyPersonnel() {
            try {
                await addDutyPersonnelConfig(this.addForm.selectedGroup, this.addForm.selectedPersonnel, this.addForm.startTime, this.addForm.endTime);
                await this.loadDutyPersonnelData();
                this.showAddDialog = false;
                Message.success('添加成功');
            } catch (error) {
                console.error('Failed to add duty personnel:', error);
            }
        },
        handleSearch() {
            this.currentPage = 1;
        },
        handlePageChange(page) {
            this.currentPage = page;
        },
        toggleShowTodayOnly() {
            this.showTodayOnly = !this.showTodayOnly;
        }
    },
};
</script>

<style scoped></style>
