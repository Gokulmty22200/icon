import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent {
  fileList: File[] = [];

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
    // Implement your file processing logic here
    alert('Files processed!');
  }
}
