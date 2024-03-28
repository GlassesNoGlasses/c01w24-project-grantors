import { Accept } from "react-dropzone"

export enum GrantQuestionFileType {
    ANY = "All",
    IMAGES = "Images",
    PDF = "PDF",
    WORD = "Word Doc",
    TEXT = "Text",
    EXCEL = "Excel",
    POWERPOINT = "Powerpoint",
    AUDIO = "Audio",
    VIDEO = "Video",
    ZIP = "Zip"
}

export function GrantQuestionFileTypesToAccept(types: GrantQuestionFileType[]): Accept {
    let accept: Accept = {};
    types.forEach((type: GrantQuestionFileType) => {
        switch(type) {
            case GrantQuestionFileType.ANY:
                accept['*/*'] = ['*'];
                break;
            case GrantQuestionFileType.IMAGES:
                accept['image/*'] = ['.png', '.jpeg', '.jpg'];
                break;
            case GrantQuestionFileType.PDF:
                accept['application/pdf'] = ['.pdf'];
                break;
            case GrantQuestionFileType.WORD:
                accept['application/msword'] = ['.doc'];
                accept['application/vnd.openxmlformats-officedocument.wordprocessingml.document'] = ['.docx'];
                break;
            case GrantQuestionFileType.TEXT:
                accept['text/plain'] = ['.txt'];
                break;
            case GrantQuestionFileType.EXCEL:
                accept['application/vnd.ms-excel'] = ['.xls'];
                accept['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] = ['.xlsx'];
                break;
            case GrantQuestionFileType.POWERPOINT:
                accept['application/vnd.ms-powerpoint'] = ['.ppt'];
                accept['application/vnd.openxmlformats-officedocument.presentationml.presentation'] = ['.pptx'];
                break;
            case GrantQuestionFileType.AUDIO:
                accept['audio/*'] = ['.mp3', '.wav', '.ogg'];
                break;
            case GrantQuestionFileType.VIDEO:
                accept['video/*'] = ['.mp4', '.avi', '.mov'];
                break;
            case GrantQuestionFileType.ZIP:
                accept['application/zip'] = ['.zip'];
                break;
        }
    });

    return accept;
}