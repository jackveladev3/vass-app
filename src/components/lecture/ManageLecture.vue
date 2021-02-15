<template>
  <div class="flex flex-col justify-between posrelative" style="height:450px;overflow-y:scroll !important">
    <div style="paddingTop:20px;paddingLeft:50px;paddingRight:50px">
      <p style="fontSize:12px;color: #34749B">指導日時を入力してください。</p>
      <div class="right-inner-addon-time2 date datepicker" style="cursor:pointer !important;">
        <v-text-field @click="toggleDatePicker" v-model="pickerFormatted" label=""  readonly height="25" width="260" class="calendertextfield" outlined dense>
          <template slot="append">
            <i class="fa fa-calendar" @click="toggleDatePicker"></i>
          </template>
        </v-text-field>
      </div>
        <div class="calenderclass">
          <v-date-picker
            class="newdatepicker"
            no-title
            :height="calenderHeight"
            v-show="isDatePickerOpen"
            @input="isDatePickerOpen = false"
            v-model="picker"
            :width="calenderWidth"
            :first-day-of-week="firstDayOfWeek"
            locale="ja-JA"
            :day-format="date => new Date(date).getDate()"
          ></v-date-picker>
        </div>
        <br>
      <div class="flex items-center" style="marginTop:4px">
        <div>
          <div class="flex items-center">
            <p class="label-text">開始時刻</p>
            <p class="label-text asterict">*</p>
          </div>
          <div @mouseleave="showTimePicker1 = false">
            <div class="right-inner-addon-time2 date datepicker" style="cursor:pointer !important;">
              <v-text-field @click="toggleTimePicker1" readonly :value="fromTime.displayName" label="" height="25" width="121" class="timefield" outlined dense>
                <template slot="append">
                  <i class="far fa-clock" @click="toggleTimePicker1"></i>
                </template>
              </v-text-field>
            </div>
            <v-card v-show="showTimePicker1" height="auto" width="121px" class="myList0 card no-shadow">
              <v-list class="custom-list" style="height:170px">
                    <v-list-item style="min-height: 20px; color: gray!important;padding:0"
                     v-for="(item,index) in timeList" :key="'time_' + index"
                    >
                      <v-list-item-title>
                      <div class="row selectTutor">
                        <div @click="selectFromTime(item)" class="listItem content-middle vertical-center" style="width: 111px;height: 24px;background: #FFFFFF;color: #5C5C5C;">
                          {{item.displayName}}
                        </div>
                        </div>
                      </v-list-item-title>
                    </v-list-item>
              </v-list>
            </v-card>
          </div>
        </div>
        <div
          class="time-separator duration-500 ease-in-out"
        />
        <div>
          <div class="flex items-center">
            <p class="label-text">終了時刻  </p>
            <p class="label-text asterict">*</p>
          </div>
          <div @mouseleave="showTimePicker2 = false">
            <div class="right-inner-addon-time2 date datepicker" style="cursor:pointer !important;">
              <v-text-field @click="toggleTimePicker2" readonly :value="toTime.displayName" label="" height="25" width="121" class="timefield" outlined dense>
                <template slot="append">
                  <i class="far fa-clock" @click="toggleTimePicker2"></i>
                </template>
              </v-text-field>
            </div>
            <v-card v-show="showTimePicker2" height="auto" width="121px" class="myList0 card no-shadow">
              <v-list class="custom-list" style="height:170px">
                    <v-list-item style="min-height: 20px; color: gray!important;padding:0"
                    v-for="(item,index) in timeList" :key="'time_' + index"
                    >
                      <v-list-item-title>
                      <div class="row selectTutor">
                        <div @click="selectToTime(item)" class="listItem content-middle vertical-center" style="width: 111px;height: 24px;background: #FFFFFF;color: #5C5C5C;">
                          {{item.displayName}}
                        </div>
                        </div>
                      </v-list-item-title>
                    </v-list-item>
              </v-list>
            </v-card>
          </div>
        </div>
      </div>
      <br>
      <p style="marginTop:10px;fontSize:12px;color: #34749B;marginBottom:0">指導を行う講師</p>
      <div class="d-flex items-center">
        <p class="label-text-l">講師を選択してください </p>
        <p class="label-text-l asterict">*</p>
      </div>
      <div @mouseleave="showTutorList = false">
        <div class="right-inner-addon-tutor date datepicker" style="cursor:pointer !important;">
          <div>
            <v-text-field @click="toggleTutorList" :class="classObject3" :value="getTutorText(this.lecture.tutor)" label=""  readonly height="25" width="380" class="step1textfield" outlined dense>
                <template slot="append">
                  <i class="fa fa-angle-down" :class="classObject4" @click="toggleTutorList"></i>
                </template>
            </v-text-field>
          </div>
        </div>

        <v-card v-show="showTutorList" height="180px" width="100%" class="no-shadow">
          <v-list class="custom-list">
            <v-list-item style="min-height: 30px; color: gray!important;padding:0 !important;"
              v-for="(item,index) in allTutors"
              :key="index"
            >
              <v-list-item-title>
                <div class="row selectTutor">
                  <div class="col-sm-4" @click="selectTutor(item)" style="padding : 0;cursor:pointer !important;padding-left:4px">{{item.familyName.substring(0,10) + ' ' + item.givenName.substring(0,8)}}</div>
                  <div class="col-sm-6" @click="selectTutor(item)" style="padding : 0;cursor:pointer !important"><div class="padding6px">{{item.email.substring(0,27)}}</div></div>
                  <div class="col-sm-1" style="padding-left : 0;padding-bottom:0;padding-top:0;padding-right:9px">
                    <v-tooltip v-show="true"  top content-class="nobg">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on" style="height: 0;">
                        <span class="v-btn__content"><i data-v-5751b188="" aria-hidden="true" class="notranslate fa fa-info-circle theme--light grey--text text--lighten-1"></i></span>
                        </v-btn>
                      </template>
                      <span style="background:white">
                        <v-card>
                        <v-card-title class="lighten-2" style="height:60px;font-size:16px">
                          Memo<hr style="width:100%;text-align:left;margin-left:70px;margin-top: -20px;border: 1px solid gray;size: 25px;">
                        </v-card-title>
                        <v-spacer></v-spacer>
                        <v-card-text style="min-width:300px">
                          {{item.memo}}
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                        </v-card-actions>
                        </v-card>
                      </span>
                    </v-tooltip>
                  </div>
                  <div class="col-sm-1" @click="editTutor(item)" style="padding: 0;cursor:pointer !important;padding-left:7px"><i class="fa fa-edit"></i></div>
                </div>
              </v-list-item-title>
            </v-list-item>
          </v-list>
          <div @click="addTutor()" class="pa-1" @click.stop="">
            <v-btn small depressed :ripple="false" style="width: 100%;background: rgb(244, 244, 244);justify-content: left;">
                + 新しく追加する
            </v-btn>
          </div>
        </v-card>
      </div>

      <p style="marginTop:10px;fontSize:12px;color: #34749B;marginBottom:0">指導を受ける生徒</p>
      <div class="d-flex items-center">
        <p class="label-text-l">生徒を選択してください </p>
        <p class="label-text-l asterict">*</p>
      </div>
      <div @mouseleave="showStudentList = false">
        <template v-if="lecture.students.length>0">
          <div v-for="(item,index) in lecture.students" :key="'studentss_' + index" style="padding-top:1px;padding-bottom:6px">
            <div class="right-inner-addon-tutor date datepicker">
              <div>
                <i @click="deSelectStudent(item)" class="fa fa-minus" style="cursor:pointer !important;"></i>
                <i @click="editStudent(item)" class="fa fa-edit dis1" style="cursor:pointer !important;"></i>
                <div style="padding-left : 0;padding-bottom:0;padding-top:0;padding-right:0px;position:absolute;right:43px;width:10px;" >
                  <v-tooltip v-show="true"  top content-class="nobg">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on" style="height: 0;">
                        <span class="v-btn__content"><i data-v-5751b188="" aria-hidden="true" class="notranslate fa fa-info-circle theme--light grey--text text--lighten-1"></i></span>
                      </v-btn>
                    </template>
                    <span style="background:white">
                      <v-card>
                        <v-card-title class="lighten-2" style="height:60px;font-size:16px">
                          Memo<hr style="width:100%;text-align:left;margin-left:70px;margin-top: -20px;border: 1px solid gray;size: 25px;">
                        </v-card-title>
                        <v-spacer></v-spacer>
                        <v-card-text style="min-width:300px">
                          {{item.memo}}
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                        </v-card-actions>
                      </v-card>
                    </span>
                  </v-tooltip>
                </div>
                <v-text-field class="step1textfield" :value="getTutorText(item)" label=""  readonly height="25" width="121" outlined dense></v-text-field>
              </div>
            </div>
          </div>
        </template>
        <div class="right-inner-addon-tutor date datepicker" style="cursor:pointer !important;">
          <div>
            <v-text-field @click="toggleStudentList" :class="classObject" value="選択してください" label=""  readonly height="25" width="380" class="step1textfield" outlined dense>
                <template slot="append">
                  <i class="fa fa-angle-down" :class="classObject1" @click="toggleStudentList"></i>
                </template>
            </v-text-field>
          </div>
        </div>
        <div>
        <v-card v-show="showStudentList" height="180px" width="100%" class="no-shadow">
          <v-list class="custom-list">
                <v-list-item style="min-height: 30px; color: gray!important;padding:0 !important;"
                v-for="(item,index) in notSelectedStudents" :key="'studentsdd_' + index"
                >
                  <v-list-item-title>
                  <div class="row selectTutor">
                      <div class="col-sm-4" @click="selectStudent(item)" style="padding : 0;cursor:pointer !important;padding-left:4px;">{{item.familyName.substring(0,10) + ' ' + item.givenName.substring(0,8)}}</div>
                      <div class="col-sm-6" @click="selectStudent(item)" style="padding : 0;cursor:pointer !important;"><div class="padding6px">{{item.email.substring(0,27)}}</div></div>
                      <div class="col-sm-1" style="padding-left : 0;padding-bottom:0;padding-top:0;padding-right:9px">
                        <v-tooltip v-show="true"  top content-class="nobg">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn icon v-bind="attrs" v-on="on" style="height: 0;">
                            <span class="v-btn__content"><i data-v-5751b188="" aria-hidden="true" class="notranslate fa fa-info-circle theme--light grey--text text--lighten-1"></i></span>
                            </v-btn>
                          </template>
                          <span style="background:white">
                            <v-card>
                            <v-card-title class="lighten-2" style="height:60px;font-size:16px">
                              Memo<hr style="width:100%;text-align:left;margin-left:70px;margin-top: -20px;border: 1px solid gray;size: 25px;">
                            </v-card-title>
                            <v-spacer></v-spacer>
                            <v-card-text style="min-width:300px">
                              {{item.memo}}
                            </v-card-text>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                            </v-card-actions>
                            </v-card>
                          </span>
                        </v-tooltip>
                      </div>
                      <div class="col-sm-1" @click="editStudent(item)" style="padding : 0;cursor:pointer !important;padding-left:7px"><i class="fa fa-edit"></i></div>
                    </div>
                  </v-list-item-title>
                </v-list-item>
          </v-list>
          <div @click="openStudentDialog()" class="pa-1" @click.stop="">
            <v-btn small depressed :ripple="false" style="width: 100%;background: rgb(244, 244, 244);justify-content: left;">
                + 新しく追加する
            </v-btn>
          </div>
        </v-card>
      </div>
      </div>
      <br>

      <v-dialog v-model="tutorEditDialog" max-width="424px">
        <v-card>
          <v-card-title>
            <span class="headline flex justify-center">講師を更新する</span>
          </v-card-title>
          <v-card-text class="flex justify-center">
            <v-container>
              <div class="row center-it">
                <div class="flex items-center new-center" style="marginTop:4px">
                  <div>
                    <div class="flex items-center">
                      <p class="label-text">姓</p>
                      <p class="label-text asterict">*</p>
                    </div>
                    <div class="right-inner-addon-time date datepicker" style="cursor:pointer !important;">
                      <div>
                        <v-text-field :rules="required" class="textfield" v-model="toBeEdittedTutor.familyName" label=""  height="24" width="121" outlined dense></v-text-field>
                      </div>
                    </div>
                  </div>
                  <div
                    class="time-separator duration-500 ease-in-out"/>
                  <div>
                    <div class="flex items-center">
                      <p class="label-text">名</p>
                      <p class="label-text asterict">*</p>
                    </div>
                    <div class="right-inner-addon-time2 date datepicker" style="cursor:pointer !important;">
                      <div>
                        <v-text-field :rules="required" class="textfield" v-model="toBeEdittedTutor.givenName" label=""  height="24" width="121" outlined dense></v-text-field>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row center-it">
                <div>
                    <div class="flex items-center">
                      <p class="label-text">メモ</p>
                    </div>
                    <div class="right-inner-addon-time date datepicker" style="cursor:pointer !important;">
                      <div>
                        <v-text-field class="textfieldfull" v-model="toBeEdittedTutor.memo" label=""  height="24" width="280" outlined dense></v-text-field>
                      </div>
                    </div>
                </div>
              </div>
              <div class="row new-center">
                <div>
                    <div class="flex items-center">
                      <p class="label-text">Eメール</p>
                      <p class="label-text asterict">*</p>
                    </div>
                    <div class="right-inner-addon-time date datepicker" style="cursor:pointer !important;">
                      <div>
                        <v-text-field :rules="emailRule.concat(required)" class="textfieldfull" v-model="toBeEdittedTutor.email" label=""  height="24" width="280" outlined dense></v-text-field>
                      </div>
                    </div>
                </div>
              </div>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <div class="flex justify-center">
              <div>
                <v-btn class="text-white next-btn1" @click="handleUpdateTutor" >登録</v-btn>
              </div>
            </div>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="studentEditDialog" max-width="424px">
        <v-form ref="form" v-model="studentEditFormValid" lazy-validation>
        <v-card>
          <v-card-title>
            <span class="headline flex justify-center">生徒の新規登録</span>
          </v-card-title>
          <v-card-text class="flex justify-center">
            <v-container>
              <div class="row center-it">
                <div class="flex items-center new-center" style="marginTop:4px">
                  <div>
                    <div class="flex items-center">
                      <p class="label-text">姓</p>
                      <p class="label-text asterict">*</p>
                    </div>
                    <div class="right-inner-addon-time date datepicker" style="cursor:pointer !important;">
                      <div>
                        <v-text-field :rules="required" class="textfield" v-model="toBeEdittedStudent.familyName" label=""  height="24" width="121" outlined dense></v-text-field>
                      </div>
                    </div>
                  </div>
                  <div
                    class="time-separator duration-500 ease-in-out"
                  />
                  <div>
                    <div class="flex items-center">
                      <p class="label-text">名</p>
                      <p class="label-text asterict">*</p>
                    </div>
                    <div class="right-inner-addon-time2 date datepicker" style="cursor:pointer !important;">
                      <div>
                        <v-text-field :rules="required" class="textfield" v-model="toBeEdittedStudent.givenName" label=""  height="24" width="121" outlined dense></v-text-field>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row new-center">
                <div>
                    <div class="flex items-center">
                      <p class="label-text">メモ</p>
                    </div>
                    <div class="right-inner-addon-time date datepicker" style="cursor:pointer !important;">
                      <div>
                        <v-text-field class="textfieldfull" v-model="toBeEdittedStudent.memo" label=""  height="24" width="280" outlined dense></v-text-field>
                      </div>
                    </div>
                </div>
              </div>
              <div class="row new-center">
                <div>
                    <div class="flex items-center">
                      <p class="label-text">Eメール</p>
                    </div>
                    <div class="right-inner-addon-time date datepicker" style="cursor:pointer !important;">
                      <div>
                        <v-text-field :rules="emailRule" class="textfieldfull" v-model="toBeEdittedStudent.email" label=""  height="24" width="280" outlined dense></v-text-field>
                      </div>
                    </div>
                </div>
              </div>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <div class="flex justify-center">
              <div>
                <v-btn class="text-white next-btn1" @click="handleUpdateStudent" >登録</v-btn>
              </div>
            </div>
          </v-card-actions>
        </v-card>
        </v-form>
      </v-dialog>

      <v-dialog v-model="studentDialog" max-width="424px">
        <v-card>
          <v-card-title>
            <span class="headline flex justify-center">生徒の新規登録</span>
          </v-card-title>
          <v-card-text class="flex justify-center">
            <v-container>
              <div class="row center-it">
                <div class="flex items-center new-center" style="marginTop:4px">
                  <div>
                    <div class="flex items-center">
                      <p class="label-text">姓</p>
                      <p class="label-text asterict">*</p>
                    </div>
                    <div class="right-inner-addon-time date datepicker" style="cursor:pointer !important;">
                      <div>
                        <v-text-field :rules="required" class="textfield" v-model="createStudentFamilyName" label=""  height="24" width="121" outlined dense></v-text-field>
                      </div>
                    </div>
                  </div>
                  <div
                    class="time-separator duration-500 ease-in-out"
                  />
                  <div>
                    <div class="flex items-center">
                      <p class="label-text">名</p>
                      <p class="label-text asterict">*</p>
                    </div>
                    <div class="right-inner-addon-time2 date datepicker" style="cursor:pointer !important;">
                      <div>
                        <v-text-field :rules="required" class="textfield" v-model="createStudentGivenName" label=""  height="24" width="121" outlined dense></v-text-field>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row center-it">
                <div>
                    <div class="flex items-center">
                      <p class="label-text">メモ</p>
                    </div>
                    <div class="right-inner-addon-time date datepicker" style="cursor:pointer !important;">
                      <div>
                        <v-text-field class="textfieldfull" v-model="createStudentMemo" label=""  height="24" width="280" outlined dense></v-text-field>
                      </div>
                    </div>
                </div>
              </div>
              <div class="row center-it">
                <div>
                    <div class="flex items-center">
                      <p class="label-text">Eメール</p>
                    </div>
                    <div class="right-inner-addon-time date datepicker" style="cursor:pointer !important;">
                      <div>
                        <v-text-field :rules="emailRule" class="textfieldfull" v-model="createStudentEmail" label=""  height="24" width="280" outlined dense></v-text-field>
                      </div>
                    </div>
                </div>
              </div>
            </v-container>
          </v-card-text>
          <v-card-actions>
              <div class="flex justify-center">
                <div>
                  <v-btn class="text-white next-btn1" @click="handleCreateStudent" >登録</v-btn>
                </div>
              </div>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="showMemo" max-width="400px">
        <v-card>
          <div class="container" style="width:100px;height:100px">
            <center>
            {{tempMemo}}
            </center>
          </div>
        </v-card>
      </v-dialog>
      <v-dialog v-model="tutorDialog" max-width="400px">
        <v-card>
          <v-card-title>
            <span class="headline flex justify-center">講師の新規登録 </span>
          </v-card-title>
          <v-card-text class="flex justify-center">
            <v-container>
              <div class="row center-it">
                <div class="flex items-center new-center" style="marginTop:4px">
                  <div>
                    <div class="flex items-center">
                      <p class="label-text">姓</p>
                      <p class="label-text asterict">*</p>
                    </div>
                    <div class="right-inner-addon-time date datepicker" style="cursor:pointer !important;">
                      <div>
                        <v-text-field :rules="required" class="textfield" v-model="createTutorFamilyName" label=""  height="24" width="121" outlined dense></v-text-field>
                      </div>
                    </div>
                  </div>
                  <div
                    class="time-separator duration-500 ease-in-out"
                  />
                  <div>
                    <div class="flex items-center">
                      <p class="label-text">名</p>
                      <p class="label-text asterict">*</p>
                    </div>
                    <div class="right-inner-addon-time2 date datepicker" style="cursor:pointer !important;">
                      <div>
                        <v-text-field class="textfield" :rules="required" v-model="createTutorGivenName" label=""  height="24" width="121" outlined dense></v-text-field>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row center-it">
                <div>
                    <div class="flex items-center">
                      <p class="label-text">メモ</p>
                    </div>
                    <div class="right-inner-addon-time date datepicker" style="cursor:pointer !important;">
                      <div>
                        <v-text-field class="textfieldfull" v-model="createTutorMemo" label=""  height="24" width="280" outlined dense></v-text-field>
                      </div>
                    </div>
                </div>
              </div>
              <div class="row center-it">
                <div>
                    <div class="flex items-center">
                      <p class="label-text">Eメール</p>
                      <p class="label-text asterict">*</p>
                    </div>
                    <div class="right-inner-addon-time date datepicker" style="cursor:pointer !important;">
                      <div>
                        <v-text-field :rules="emailRule.concat(required)" class="textfieldfull" v-model="createTutorEmail" label=""  height="24" width="280" outlined dense></v-text-field>
                      </div>
                    </div>
                </div>
              </div>
            </v-container>
          </v-card-text>
          <v-card-actions>
              <div class="flex justify-center">
                <div>
                  <v-btn class="text-white next-btn1" @click="handleCreateTutor" >登録</v-btn>
                </div>
              </div>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <div class="flex">
      <div v-if="isEdit" class="flex">
        <v-btn class="text-white delete-btn" @click="onDelete">指導を削除</v-btn>
        <button
          class="bg-button text-white save-btn"
          @click="handleSave"
        >変更を保存</button>
      </div>
      <div class="flex justify-end" style="position:relative">
        <div>
          <br>
          <v-btn class="text-white next-btn1" @click="handleNext" >次へ</v-btn>
        </div>
      </div>
      <br>
    </div>
    <br>
  </div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import * as adminService from '@/services/admin';
import VCalendar from 'v-calendar'
import { SET_LECTURE_ACTION } from '@/store/actionTypes';
import { mapState } from 'vuex';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import Constant from '@/services/constants';

Vue.use(Loading);

export default {
  name: 'ManageLecture',
  data () {
    return {
      constant: Constant,
      menu:true,
      isActive: [],
      fromTime: '',
      toTime: '',
      notSelectedStudents:[],
      allTutors: [],
      allStudents: [],
      tutorDialog: false,
      studentDialog: false,
      createStudentFamilyName: '',
      createStudentGivenName: '',
      createStudentEmail: '',
      createStudentMemo:'',
      createTutorFamilyName: '',
      createTutorGivenName: '',
      createTutorEmail: '',
      createTutorMemo:'',
      picker:'',
      pickerFormatted:'',
      calenderLocale:'ja',
      isDatePickerOpen:false,
      showTimePicker1:false,
      showTimePicker2:false,
      showTutorList:false,
      showStudentList:false,
      calenderWidth:'260',
      firstDayOfWeek:1,
      calenderHeight:'200',
      timeList:[],
      tempMemo:'',
      showMemo:false,
      studentEditDialog:false,
      tutorEditDialog:false,
      toBeEdittedStudent:
      {
        id:"",
        familyName:"",
        givenName:"",
        email:"",
        emailSent:false,
        URL:"",
        workbooks:[],
        memo:""
      },
      toBeEdittedTutor:
      {
        id:"",
        familyName:"",
        givenName:"",
        email:"",
        emailSent:false,
        memo:""
      },
      myloader:'',
      required:[v => v != '' || 'Field is required'],
      emailRule:[v => !v || /.+@.+\..+/.test(v) || 'E-mail must be valid'],
      emailRuleMandatory:[v => !v || /.+@.+\..+/.test(v) || 'E-mail must be valid'],
      studentEditFormValid:false
    }
  },
  props: {
    year: Number,
    month: Number,
    date: Number,
    onNext: Function,
    onDelete: Function,
    onSave: Function,
    isEdit: Boolean
  },
  computed: {
    ...mapState({
      lecture: state => state.lecture.lecture
    }),
    classObject3() {
      if(this.showTutorList==true) {
        return 'bgblue';
      } else if(this.showTutorList ==false) {
        return '';
      }
    },
    classObject4() {
      if(this.showTutorList==true) {
        return 'bgblue1';
      } else if(this.showTutorList ==false) {
        return '';
      }
    },
    classObject() {
      if(this.showStudentList==true) {
        return 'bgblue';
      } else if(this.showStudentList ==false) {
        return '';
      }
    },
    classObject1() {
      if(this.showStudentList==true) {
        return 'bgblue1';
      } else if(this.showStudentList == false) {
        return '';
      }
    }
  },
  created () {
    this.isActive[0] = true;

    if (this.lecture.startTime.value === '') {

    } else {
      this.fromTime = moment(this.lecture.startTime).format('HH:mm')
      this.toTime = moment(this.lecture.endTime).format('HH:mm')
    }
    for(var i=0 ;i<24; i++) {
      for(var j=0; j<4; j++) {
        var obj = {};
        if(i<=11) {
          obj.displayName = '午前 ';
          if(i<=9) {
            obj.displayName = obj.displayName + '0' + i;
            obj.value = '0' + i;
          } else if(i>9) {
            obj.displayName = obj.displayName + '' + i;
            obj.value = '' + i;
          }
          if(j==0) {
            obj.displayName = obj.displayName + ':00';
            obj.value = obj.value + ':00'
          } else if(j==1) {
            obj.displayName = obj.displayName + ':15';
            obj.value = obj.value + ':15'
          } else if(j==2) {
            obj.displayName = obj.displayName + ':30';
            obj.value = obj.value + ':30'
          } else if(j==3) {
            obj.displayName = obj.displayName + ':45';
            obj.value = obj.value + ':45'
          }
          this.timeList.push(obj);
        } else if(i>11) {
          obj.displayName = '午後 ';
          if(i==12) {
            obj.displayName = obj.displayName + '' + i;
            obj.value = '' + i;
          } else if(i>12 && i<22) {
            obj.displayName = obj.displayName + '0' + (i-12);
            obj.value = '' + i;
          } else {
            obj.displayName = obj.displayName + '' + (i-12);
            obj.value = '' + i;
          }
          if(j==0) {
            obj.displayName = obj.displayName + ':00';
            obj.value = obj.value + ':00'
          } else if(j==1) {
            obj.displayName = obj.displayName + ':15';
            obj.value = obj.value + ':15'
          } else if(j==2) {
            obj.displayName = obj.displayName + ':30';
            obj.value = obj.value + ':30'
          } else if(j==3)
          {
            obj.displayName = obj.displayName + ':45';
            obj.value = obj.value + ':45'
          }
          this.timeList.push(obj);
        }
      }
    }
    this.loadAllUsers();
  },
  mounted() {
    if(this.lecture.students[0].id=="") {
      /*let tempObj = {
        ...this.lecture,
      };*/
      let tempObj = JSON.parse(JSON.stringify(this.lecture)); 
      tempObj.students = [];
      this.$store.dispatch(SET_LECTURE_ACTION, tempObj);
    }
    this.picker = this.lecture.startTime.split(" ")[0];
    var myStartTime = this.lecture.startTime.split(" ")[1];
    var myEndTime = this.lecture.endTime.split(" ")[1];
    for(var i=0;i<this.timeList.length;i++) {
      if(myStartTime == this.timeList[i].value) {
        this.fromTime = this.timeList[i];
      }
      if(myEndTime == this.timeList[i].value) {
        this.toTime = this.timeList[i];
      }
    }
    if(document.getElementsByClassName('vm--container') != [] && document.getElementsByClassName('vm--container') != null)
    {
      document.getElementsByClassName('vm--container')[0].style.overflowY ="scroll";
    }
    if(document.getElementsByClassName('vm--modal') != [] && document.getElementsByClassName('vm--modal') != null)
    {
      document.getElementsByClassName('vm--modal')[0].style.height ='';
    }
    if(document.getElementsByClassName('v-date-picker-title__date')[0] != [] && document.getElementsByClassName('v-date-picker-title__date')[0] != null)
    {
      document.getElementsByClassName('v-date-picker-title__date')[0].style.display = "none";
    }
  },
  watch: {
    picker (val) {
      this.pickerFormatted = this.formatDate(this.picker)
    },
  },
  methods: {
    validateEmail(emailField){
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(emailField).toLowerCase());
    },
    startLoader() {
			this.myloader = this.$loading.show({ canCancel: false, color:'#34749B' });
		},
		stopLoader() {
			this.myloader.hide();
    },
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${year}/${month}/${day}`
    },
    editStudent(item) {
      this.toBeEdittedStudent = item;
      this.studentEditDialog = true;
    },
    editTutor(item) {
      this.toBeEdittedTutor = item;
      this.tutorEditDialog = true;
    },
    async handleUpdateStudent() {
      if(this.toBeEdittedStudent.id=='' || this.toBeEdittedStudent.id==null || this.toBeEdittedStudent.givenName == '' || this.toBeEdittedStudent.familyName == '')
      {
        return;
      }
      if(this.toBeEdittedStudent.email != '')
      {
        if(this.validateEmail(this.toBeEdittedStudent.email == false))
        {
          return;
        }
      }
      let data = {
        studentId: this.toBeEdittedStudent.id,
        studentName: this.toBeEdittedStudent.givenName,
        studentFamilyName: this.toBeEdittedStudent.familyName,
        email: this.toBeEdittedStudent.email,
        memo: this.toBeEdittedStudent.memo
      }
      this.startLoader();

      let result = false;
      try
      {
        result = await adminService.updateStudent(data);
      }
      catch(e)
      {
        this.stopLoader();
        console.log(e);
        return;
      }
      if(result) {
        this.stopLoader();
        this.studentEditDialog = false;
        if(result.status == 200) {

          for(var i=0;i<this.allStudents.length;i++) {
            if(this.allStudents[i].id == this.toBeEdittedStudent.id) {
              this.allStudents[i].givenName = this.toBeEdittedStudent.givenName,
              this.allStudents[i].familyName = this.toBeEdittedStudent.familyName,
              this.allStudents[i].email = this.toBeEdittedStudent.email,
              this.allStudents[i].memo = this.toBeEdittedStudent.memo
            }
          }

          for(var i=0;i<this.notSelectedStudents.length;i++) {
            if(this.notSelectedStudents[i].id == this.toBeEdittedStudent.id) {
              this.notSelectedStudents[i].givenName = this.toBeEdittedStudent.givenName,
              this.notSelectedStudents[i].familyName = this.toBeEdittedStudent.familyName,
              this.notSelectedStudents[i].email = this.toBeEdittedStudent.email,
              this.notSelectedStudents[i].memo = this.toBeEdittedStudent.memo
            }
          }
          var tempObj = JSON.parse(JSON.stringify(this.lecture));
          for(var i=0;i<tempObj.students.length;i++) {
            if(tempObj.students[i].id == this.toBeEdittedStudent.id) {
              tempObj.students[i].givenName = this.toBeEdittedStudent.givenName,
              tempObj.students[i].familyName = this.toBeEdittedStudent.familyName,
              tempObj.students[i].email = this.toBeEdittedStudent.email,
              tempObj.students[i].memo = this.toBeEdittedStudent.memo
            }
          }
          this.$store.dispatch(SET_LECTURE_ACTION, tempObj);
          this.toBeEdittedStudent = {
          id:"",
          familyName:"",
          givenName:"",
          email:"",
          emailSent:false,
          URL:"",
          workbooks:[],
          memo:""
          }
        }
      }
    },
    async handleUpdateTutor() {
      if(this.toBeEdittedTutor.id == '' || this.toBeEdittedTutor.id == null || this.toBeEdittedTutor.givenName=='' || this.toBeEdittedTutor.familyName=='' || this.toBeEdittedTutor.email=='' || this.validateEmail(this.toBeEdittedTutor.email)==false)
      {
        return;
      }
      let data = {
        tutorId: this.toBeEdittedTutor.id,
        tutorFirstName: this.toBeEdittedTutor.givenName,
        tutorFamilyName: this.toBeEdittedTutor.familyName,
        email: this.toBeEdittedTutor.email,
        memo: this.toBeEdittedTutor.memo
      }
      this.startLoader();

      let result = await adminService.updateTutor(data);

      if(result) {
        this.stopLoader();
        this.tutorEditDialog = false;
        if(result.status == 200)
        {
          for(var i=0;i<this.allTutors.length;i++)
          {
            if(this.allTutors[i].id == this.toBeEdittedTutor.id)
            {
              this.allTutors[i].givenName = this.toBeEdittedTutor.givenName,
              this.allTutors[i].familyName = this.toBeEdittedTutor.familyName,
              this.allTutors[i].email = this.toBeEdittedTutor.email,
              this.allTutors[i].memo = this.toBeEdittedTutor.memo
            }
          }
          this.toBeEdittedTutor = {
            id:"",
            familyName:"",
            givenName:"",
            email:"",
            emailSent:false,
            memo:""
          }
        }
      }
    },
    displayMemo(memo) {
      if(memo) {
      } else {
        this.tempMemo = this.constant.tempMemo;
        this.showMemo = true;
      }
    },
    openStudentDialog() {
      this.studentDialog = true;
    },
    addTutor() {
      this.tutorDialog = true;
    },
    getTutorText(tutorObject) {
      var str = "";
      str = tutorObject.familyName.substring(0,10)  + '  ' + tutorObject.givenName.substring(0,8);
      if(str.length<20) {
        var count = 0;
        count = 20 - str.length;
        for(var i=0;i<count;i++) {
          str = str + ' ';
        }
      }
      str = str + ' ' + tutorObject.email;
      return str;
    },
    selectTutor(val) {
      let tempObj = {
        ...this.lecture,
      };
      tempObj.tutor = val;
      this.$store.dispatch(SET_LECTURE_ACTION, tempObj);
      this.showTutorList = false;
    },
    selectStudent(val) {
      this.showStudentList = false;
      let tempObj = JSON.parse(JSON.stringify(this.lecture));
      for(var i = 0; i < this.notSelectedStudents.length; i++) {
				if( this.notSelectedStudents[i].id === val.id) {
          this.notSelectedStudents.splice(i, 1);
          tempObj.students.push(val);
				}
      }
      this.$store.dispatch(SET_LECTURE_ACTION,tempObj);
    },
    selectFromTime(val) {
      this.fromTime = val;
      let tempObj = {
        ...this.lecture,
      };
      tempObj.startTime = val.value;
      this.$store.dispatch(SET_LECTURE_ACTION, tempObj);
      this.showTimePicker1 = false;
    },
    selectToTime(val) {
      this.toTime = val;
      let tempObj = {
        ...this.lecture,
      };
      tempObj.endTime = val.value;
      this.$store.dispatch(SET_LECTURE_ACTION, tempObj);
      this.showTimePicker2 = false;
    },
    showTime(value) {
    },
    toggleStudentList() {
      if(this.showStudentList==true) {
        this.showStudentList = false;
      } else if(this.showStudentList==false) {
        this.showStudentList = true;
      }
      this.showTimePicker2 = false;
      this.showTimePicker1 = false;
      this.showTutorList = false;
    },
    toggleTutorList() {
      if(this.showTutorList==true) {
        this.showTutorList = false;
      } else if(this.showTutorList==false) {
        this.showTutorList = true;
      }
      this.showTimePicker2 = false;
      this.showTimePicker1 = false;
      this.showStudentList = false;
    },
    toggleTimePicker2() {
      if(this.showTimePicker2==true) {
        this.showTimePicker2 = false;
      } else if(this.showTimePicker2==false) {
        this.showTimePicker2 = true;
      }
      this.showTutorList = false;
    },
    toggleTimePicker1() {
      if(this.showTimePicker1==true) {
        this.showTimePicker1 = false;
      } else if(this.showTimePicker1==false) {
        this.showTimePicker1 = true;
      }
      this.showTutorList = false;
    },
    toggleDatePicker() {
      if(this.isDatePickerOpen==true) {
        this.isDatePickerOpen = false;
      } else if(this.isDatePickerOpen==false) {
        this.isDatePickerOpen = true;
      }
    },
    async loadAllUsers () {

      let result = await adminService.getTutorInfo();

      for (const tutor of result.data) {
        this.allTutors.push({
          id: tutor.tutorId,
          familyName: tutor.tutorFamilyName,
          givenName: tutor.tutorFirstName,
          email: tutor.email,
          emailSent: false,
          URL: '',
          memo: tutor.memo
        })
      }

      result = await adminService.getStudentInfo();

      if(result.data.length>0) {
        for (const student of result.data) {
          if(!this.lecture.students.some(el => el.id === student.studentId)) {
            this.allStudents.push({
              id: student.studentId,
              familyName: student.studentFamilyName,
              givenName: student.studentName,
              email: student.email,
              emailSent: false,
              URL: '',
              workbooks: [],
              memo:student.memo
            });
          }
        }
        this.notSelectedStudents = this.allStudents;
      }
    },
    timeNow () {
      return moment().format('HH:mm')
    },
    applyData () {
      if (this.fromTime.value === '') return false;
      if (this.toTime.value === '') return false;
      if(this.picker === '') return false;

      if (this.lecture.tutor === '') return false;

      if (this.lecture.tutor.familyName === '') return false;
      if (this.lecture.tutor.givenName === '') return false;
      if (this.lecture.tutor.email === '') return false;

      if(!(this.lecture.students.length>0))
      {
        return false;
      }

      var str1 =  this.fromTime.value.split(':');
      var str2 =  this.toTime.value.split(':');

      var totalSeconds1 = parseInt(str1[0] * 3600 + str1[1] * 60 + str1[0]);
      var totalSeconds2 = parseInt(str2[0] * 3600 + str2[1] * 60 + str2[0]);
      if(totalSeconds1 >= totalSeconds2 )
      {
        return false;
      }
      /*let tempObj = {
        ...this.lecture,
      };*/
      let tempObj = JSON.parse(JSON.stringify(this.lecture))
      tempObj.startTime = this.picker + ' ' + this.fromTime.value;
      tempObj.endTime = this.picker + ' ' + this.toTime.value;
      this.$store.dispatch(SET_LECTURE_ACTION,tempObj);

      return true;
    },
    handleNext () {
      if (this.applyData()) this.onNext();
    },
    deSelectStudent(object) {
      let tempObj = JSON.parse(JSON.stringify(this.lecture));
      for(var i = 0; i < tempObj.students.length; i++) {
				if( tempObj.students[i].id === object.id) {
          tempObj.students.splice(i, 1);
          this.notSelectedStudents.push(object);
				}
      }
      this.$store.dispatch(SET_LECTURE_ACTION,tempObj);
    },
    async handleCreateTutor () {
      if(this.createTutorFamilyName=='' || this.createTutorGivenName=='' || this.createTutorEmail=='' || this.validateEmail(this.createTutorEmail)==false)
      {
        return;
      }
      let data = {
        type: 'create',
        tutorFamilyName: this.createTutorFamilyName,
        tutorFirstName: this.createTutorGivenName,
        email: this.createTutorEmail,
        memo:this.createTutorMemo,
        enterpriseId: process.env.VUE_APP_ENTERPRISE_ID
      }
      this.startLoader();

      let result = await adminService.tutorLogin(data);

      if(result) {
        this.stopLoader();

        if(result.status == 200) {
          this.tutorDialog = false;
          this.allTutors.push({
            id: result.data.tutorId,
            email: result.data.email,
            familyName: result.data.tutorFamilyName,
            givenName: result.data.tutorFirstName,
            emailSent: false,
            URL: '',
            memo: result.data.memo
          })
          this.createTutorFamilyName = "";
          this.createTutorEmail = "";
          this.createTutorGivenName = "";
          this.createTutorMemo = "";
        }
      }
    },
    async handleCreateStudent () {
      if(this.createStudentFamilyName == '' || this.createStudentGivenName == '')
      {
        return;
      }
      if(this.createStudentEmail != '')
      {
        if(this.validateEmail(this.createStudentEmail)==false)
        {
          return;
        }
      }
      let data = {
        type: 'create',
        studentFamilyName: this.createStudentFamilyName,
        studentName: this.createStudentGivenName,
        email: this.createStudentEmail,
        enterpriseId: process.env.VUE_APP_ENTERPRISE_ID,
        memo:this.createStudentMemo
      }
      this.startLoader();

      let result = await adminService.studentLogin(data);

      if(result) {
        this.stopLoader();
        this.studentDialog = false
        if(result.status == 200)
        {
          if(this.allStudents.some(el => (result.data.studentId == el.id)))
          {
              for(var i=0;i< this.allStudents.length;i++)
              {
                if(this.allStudents[i].id == result.data.studentId)
                {
                  var obj = {
                      id: result.data.studentId,
                      email: result.data.email,
                      familyName: result.data.studentFamilyName,
                      givenName: result.data.studentName,
                      emailSent: false,
                      URL: '',
                      workbooks: [],
                      memo: result.data.memo
                  }
                  this.allStudents[i] = obj;
                }
              }
          }
          else
          {
            this.allStudents.push({
              id: result.data.studentId,
              email: result.data.email,
              familyName: result.data.studentFamilyName,
              givenName: result.data.studentName,
              emailSent: false,
              URL: '',
              workbooks: [],
              memo: result.data.memo
            });
          }
        }
        this.createStudentFamilyName = "";
        this.createStudentGivenName = "";
        this.createStudentEmail = "";
        this.createStudentMemo = "";
      }
    },
    handleSave () {
      if (this.applyData()) this.onSave()
    }
  }
}
</script>

<style scoped>

.date-time-picker {
  width: 94%;
  margin-left: 0;
}

.label-text {
  font-size:8px;
  margin-bottom:0;
  color: #979797;
}

.label-text-l {
  font-size:10px;
  margin-bottom:0
}

.label-required {
  color:#D0021B;
  margin-bottom:0
}

.time-separator {
  width: 17px;
  margin: 8px 10px -12px;
}

.delete-btn {
  border-radius:2px;
  height:30px;
  width:98px;
  outline:none;
  box-shadow:0px 2px 4px #00000080;
  margin-bottom:17px;
  margin-left:14px;
  font-size:12px;
  background-color:#FF7B80
}

.save-btn {
  border-radius:2px;
  height:30px;
  width:98px;
  outline:none;
  box-shadow:0px 2px 4px #00000080;
  margin-bottom:17px;
  margin-left:14px;
  font-size:12px
}

.next-btn {
  background:#34749B;
  border-radius:2px;height:30px;
  width:98px;
  outline:none;
  box-shadow:0px 2px 4px #00000080;
  bottom:145px;
  margin-right:14px;
  font-size:12px
}
.next-btn1 {
  background:#34749B !important;
  border-radius:2px;height:30px;
  width:98px;
  height: 30px !important;
  outline:none;
  box-shadow:0px 2px 4px #00000080;
  bottom:10px;
  color:white !important;
  margin-right:14px;
  font-size:12px;
}

.datePicker {
  background: transparent;
  z-index: 1050;
  position: fixed;
  cursor:pointer;
}

.right-inner-addon {
  position: relative;
}

.right-inner-addon input {
  padding-right: 30px;
}

.right-inner-addon i {
	position:absolute;
  right: 133px;
  padding: 4px 0px;
}

.right-inner-addon-time {
  position: relative;
}

.right-inner-addon-time2 {
  position: relative;
}

.right-inner-addon-time i {
	position:absolute;
  left: 88px;
  padding: 4px 13px;
}




.right-inner-addon-tutor {
  position: relative;
}



.right-inner-addon-tutor i.fa-edit {
	position:absolute;
  right: 50px;
  padding: 4px 0px;
}

.right-inner-addon-tutor i.fa-plus {
	position:relative;
  right: 20px;
  padding: 4px 0px;
}

.right-inner-addon-tutor i.fa-minus {
	position:absolute;
  right: -40px;
  padding: 4px 13px;
}

.right-inner-addon-tutor i.fa-info-circle {
	position:absolute;
  right: 26px;
  padding: 5px 0px;
}

.right-inner-addon-tutor i.dis1 {
	position:absolute;
  right: 1px;
  padding: 4px 13px;
  z-index: 10;
}

.right-inner-addon-tutor i.dis2 {
	position:absolute;
  right: 29px;
  padding: 4px 13px;
}

.posrelative div.myList0 {
  height: 115px;
  z-index: 1000;
  position: absolute;
  scrollbar-color: rgb(207, 203, 203) !important;
  border: 1px solid rgb(207, 203, 203);
  border-top: none !important;
}
.posrelative div.calenderclass {
  position: absolute;
  z-index: 40;
}
newdatepicker{
    background: transparent;
  z-index: 1050;
  cursor:pointer;
}

.myList {
  height: 115px;
  overflow-y:scroll;
  z-index: 1000;
  position: relative;
  scrollbar-color: rgb(207, 203, 203) !important;
  border: 1px solid rgb(207, 203, 203);
  border-bottom: none !important;
}

.myList1 {
  z-index: 1000;
  position: relative;
  border: 1px solid rgb(207, 203, 203);
  border-top:none !important;
  background: #F4F4F4;
}

.myList2 {
  height: 100px;
  overflow-y:scroll;
  z-index: 1000;
  position: relative;
  scrollbar-color: rgb(207, 203, 203) !important;
  border: 1px solid rgb(207, 203, 203);
  border-bottom: none !important;
  background: white;
}

.listItem:hover {
  cursor:pointer;
  background: rgb(207, 203, 203) !important;
  background-color: rgb(207, 203, 203) !important;
}

input:read-only {
  cursor: pointer !important;
}

.asterict {
  color:#D0021B !important;
  font-size: 16px !important;
  padding-left: 5px;
}

.tutor-input {
  display: flex;
  align-items: center;
  padding-left: 4px;
}

.tutor-item {
  font-size: 14px;
  line-height: 9px;
  display: flex;
  align-items: center;
  letter-spacing: 1px;
  color: #4A4A4A;
  padding-top: 2px;
  padding-bottom: 2px;
  font-size: 14px;
}

::-webkit-scrollbar-track {
  background: white !important;
}

::-webkit-scrollbar-thumb {
  background: #DEDEDE !important;
}

.row.selectTutor {
  margin:0 !important;
  font-size: small;
}

.bgblue {
  background: #57A9CA;
  color:white !important;
}

.bgblue1 {
  color:white !important;
}

.headline {
  color: #34749B !important;
}

.v-text-field {
  display: flex;
  align-items: center;
  text-align: justify;
  letter-spacing: 0.916716px;
  color: #979797;
}

.vm--container {
  overflow-y: scroll !important;
}

.fa {
  color : #B4B4B4;
}

.fas {
  color : #B4B4B4;
}

.far {
  color : #B4B4B4;
}

.custom-list {
  max-height:150px;
  overflow: auto;
  padding: none !important;
}

.pa-1 {
  background: white;
  position:relative !important;
}
.v-application .pa-1 {

    padding-left:0 !important;
    padding-right: 0px!important;
}
.no-shadow {
  box-shadow: none;
}

.v-list {
  padding: none !important;
}

.no-padding {
    padding: none !important;
}

.nobg {
  background-color: transparent;
}
.row.center-it{
  justify-content: center;
}
.new-center{
   justify-content: center;
}
.content-middle{
  display:flex;
  justify-content: center;
}

.textfield >>>.v-input input {
max-height: 24px;
max-width:121px;
width:121px !important;
background-color: red !important;
}

.textfield >>>.v-input__slot{
min-height: 24px !important;
min-width:121px !important;
width:121px !important;
}
.textfield >>>.v-text-field{
      width: 121px !important;
}
.textfield >>>.v-text-field__details{
  margin-bottom: 0px !important;
      margin-top:0px !important;
}
.textfieldfull >>>.v-input input {
max-height: 24px;
max-width:280px;
width:280px !important;
background-color: red !important;
}

.textfieldfull >>>.v-input__slot{
min-height: 24px !important;
min-width:280px !important;
width:280px !important;
}
.textfieldfull >>>.v-text-field{
      width: 280px !important;
}
.textfieldfull >>>.v-text-field__details{
        margin-bottom: 0px !important;
      margin-top:0px !important;
}
.vertical-center{
  align-items: center;
}
.theme--light.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn-outlined) {
  cursor: not-allowed;
  background-color: #34749B !important;
  color:white !important;
}
.new-student{
  width:380px;
  border: 0.5px solid #979797;
  box-sizing: border-box;
  border-radius: 3px;
  outline:none;
  border-style:solid;
  font-size: 14px;
  height:25px !important;
}
.step1textfield >>>.v-input input {
max-height: 25px;
max-width:380px;
width:380px !important;
background-color: red !important;
cursor:pointer !important;
}

.step1textfield >>>.v-input__slot{
min-height: 25px !important;
min-width:380px !important;
width:380px !important;
cursor:pointer !important;
    margin: 0 !important;
}
.step1textfield >>>.v-text-field{
      width: 380px !important;
      cursor:pointer !important;
}
.step1textfield >>>.v-text-field__details{
  display:none;
}
.step1textfield >>>.v-input--dense>.v-input__control>.v-input__slot {
    margin: 0 !important;
    margin-bottom: 0px;
}
.datepicker >>> .v-input--is-focused fieldset{
  border: 1px solid;
  border-color: #00000061;
   cursor:pointer !important;
}
.datepicker >>> fieldset{
  cursor:pointer !important;
}
.timefield >>>.v-input input {
max-height: 25px;
max-width:121px;
width:121px !important;
background-color: red !important;
cursor:pointer !important;
}

.timefield >>>.v-input__slot{
min-height: 25px !important;
min-width:121px !important;
width:121px !important;
cursor:pointer !important;
    margin: 0 !important;
}
.timefield >>>.v-text-field{
      width: 121px !important;
      cursor:pointer !important;
}
.timefield >>>.v-text-field__details{
  display:none;
}
.timefield >>>.v-input--dense>.v-input__control>.v-input__slot {
    margin: 0 !important;
    margin-bottom: 0px;
}
.timefield >>>.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-inner, .v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-outer, .v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__prepend-inner, .v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__prepend-outer, .v-text-field--full-width.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-inner, .v-text-field--full-width.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-outer, .v-text-field--full-width.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__prepend-inner, .v-text-field--full-width.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__prepend-outer {
        margin-top: 5px !important;
}
.timefield >>>.v-input__append-inner{
  margin-top: 5px !important;
}
.calendertextfield >>>.v-input__append-inner{
  margin-top: 5px !important;
}
.calendertextfield >>>.v-input input {
max-height: 25px;
max-width:260px;
width:260px !important;
background-color: red !important;
cursor:pointer !important;
}

.calendertextfield >>>.v-input__slot{
min-height: 25px !important;
min-width:260px !important;
width:260px !important;
cursor:pointer !important;
    margin: 0 !important;
}
.calendertextfield >>>.v-text-field{
      width: 260px !important;
      cursor:pointer !important;
}
.calendertextfield >>>.v-text-field__details{
  display:none;
}
.calendertextfield >>>.v-input--dense>.v-input__control>.v-input__slot {
    margin: 0 !important;
    margin-bottom: 0px;
}
.pulltobottom{
  position: absolute;
    right: 15px;
bottom:   15px;
}
</style>
