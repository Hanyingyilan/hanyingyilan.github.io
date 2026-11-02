import {escapeHTML as esc} from './html.mjs';
export function validateVideo(video){
 if(!Number.isFinite(video.durationSeconds)||video.durationSeconds<=0||!video.title||!video.description||!Array.isArray(video.cues)||!video.cues.length)throw Error('invalid video metadata');
 if(video.published!==null&&(!/^\d{4}-\d{2}-\d{2}$/.test(video.published)||new Date(video.published).toISOString().slice(0,10)!==video.published))throw Error('invalid video publication date');
 if(!['pending-human','reviewed'].includes(video.audioReview))throw Error('invalid audio review');
 if(video.audioReview==='reviewed'&&!video.audioReviewedAt)throw Error('audio review date required');
 if(new URL(video.sourceURL).protocol!=='https:')throw Error('invalid video source');
 let previous=0;
 for(const cue of video.cues){
  if(!Number.isFinite(cue.start)||!Number.isFinite(cue.end)||cue.start<previous||cue.start>=cue.end||cue.end>video.durationSeconds||typeof cue.text!=='string'||!cue.text.trim()||/[<>\r\n]/.test(cue.text))throw Error('invalid video cue');
  previous=cue.end;
 }
}
function timestamp(seconds){
 const ms=Math.round(seconds*1000);
 return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}.${String(ms%1000).padStart(3,'0')}`;
}
export function renderVTT(video){
 validateVideo(video);
 return 'WEBVTT\n\n'+video.cues.map(c=>`${timestamp(c.start)} --> ${timestamp(c.end)}\n${c.text}\n`).join('\n');
}
export function renderTranscript(video){
 validateVideo(video);
 const review=video.audioReview==='reviewed'?'字幕與音訊已完成複核。':'文字版依影片畫面字幕整理，尚待完整音訊人工複核。';
 return `<details class="video-transcript"><summary>閱讀〈${esc(video.title)}〉字幕文字版</summary><p>${esc(video.description)}</p><p>片長：約 ${Math.round(video.durationSeconds)} 秒。原始發布日期：${video.published||'未確認'}。</p><p>${review} 保留影片原有稱呼，不代表本站確認其中人物已就任或提案已實施。</p><ol>${video.cues.map(c=>`<li><span class="fine">${timestamp(c.start).slice(3,8)}</span> ${esc(c.text)}</li>`).join('')}</ol><p><a href="${esc(video.sourceURL)}" target="_blank" rel="noopener">查看原始影片貼文</a> · <a href="assets/videos/courage-for-hometown.zh-Hant.vtt">下載字幕文字檔</a></p></details>`;
}
