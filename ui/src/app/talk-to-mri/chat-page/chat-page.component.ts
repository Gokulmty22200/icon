import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { SharedService } from 'src/app/shared/services/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent {
  @ViewChild('scrollTarget') scrollTarget: ElementRef;
  @ViewChild('contentDiv') contentDiv: ElementRef;

  fileList: File[] = [];
  overlayVisible: boolean = true;
  uploadSuccess: boolean = false;
  uploadfailed: boolean = false;
  chatMessages: { type: string, message: string }[] = [
    { type: 'bot', message: 'Hello! How can I help you?'},
  ];
  messageForm: FormGroup;
  isnewUser: boolean = true;
  inProcess: boolean = false

  constructor(private sharedService: SharedService, private viewportScroller: ViewportScroller, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.messageForm = this.formBuilder.group({
      message: ['', Validators.required]
    });
    this.loadChatData();
  }

  ngAfterViewInit(): void {
    if(this.isnewUser){
      this.scrollToDiv();
    }
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    this.handleFiles(files);
  }

  onDragOver(event: any) {
    event.preventDefault();
  }

  onDrop(event: any) {
    event.preventDefault();
    const files: FileList = event.dataTransfer.files;
    this.handleFiles(files);
  }

  handleFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.fileList.push(files.item(i)!);
    }
  }

  removeFile(index: number) {
    this.fileList.splice(index, 1);
  }

  processFiles() {
    this.inProcess = true;
    const formData = new FormData();
    for (let i = 0; i < this.fileList.length; i++) {
      formData.append('file', this.fileList[i]);
    }
    this.sharedService.uploadFile(formData).subscribe(
      (response: any) => {
        this.uploadSuccess = true; 
        this.fileList = [];
        this.messageForm.controls['message'].enable();
        this.scrollToChat();
        this.inProcess = false;
      },
      error => {
        this.uploadfailed = true;
        this.inProcess = false;
        console.error('Upload error', error);
      }
    );
  }

  scrollToChat(){
    this.overlayVisible = false;
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  scrollToDiv() {
    const target = this.scrollTarget.nativeElement;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  dismissAlert() {
    this.uploadSuccess = false; 
    this.uploadfailed = false;
  }

  sendMessage() {
    if (this.messageForm.valid) {
      const userMessage = this.messageForm.value.message;
      this.chatMessages.push({ type: 'user', message: userMessage});
      this.chatMessages.push({ type: 'bot', message: '. . .'});
    this.messageForm.controls['message'].disable();
      this.sharedService.sendMessage(userMessage).subscribe(
        (response: any) => {
          this.chatMessages.pop();
          this.chatMessages.push({ type: 'bot', message: response.data});
          this.saveChatData();
    this.messageForm.controls['message'].enable();
        },
        error => {
        this.messageForm.controls['message'].enable();
        this.chatMessages.pop();
        this.chatMessages.push({ type: 'bot', message: 'Unable to Process. Please Try after Sometime.'});
          console.error('Upload error', error);
        }
      );
      this.messageForm.reset();
    }
  }

  generateTextFile() {
    const chatData = this.chatMessages.map(message => `${message.type === 'bot' ? 'Bot' : 'User'}: ${message.message}`).join('\n');
    const blob = new Blob([chatData], { type: 'text/plain' });
    return blob;
  }

  downloadFile() {
    const blob = this.generateTextFile();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat_data.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  saveChatData() {
    const chatDataString = JSON.stringify(this.chatMessages);
    localStorage.setItem('chatData', chatDataString);
  }

  loadChatData() {
    const chatDataString = localStorage.getItem('chatData');
    if (chatDataString) {
      this.isnewUser = false;
      this.overlayVisible = false;
      this.chatMessages = JSON.parse(chatDataString);
    }
  }
}
