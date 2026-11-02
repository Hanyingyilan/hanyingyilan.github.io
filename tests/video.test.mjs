import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateVideo,renderTranscript,renderVTT} from '../src/video.mjs';
const video=JSON.parse(readFileSync('content/video.json','utf8'));
test('video has bounded ordered subtitles and explicit evidence limits',()=>{
 validateVideo(video);assert.equal(video.durationSeconds,47.203991);
 assert.equal(video.published,null);assert.equal(video.audioReview,'pending-human');
 assert.ok(video.cues.length>20);
 for(const cues of [[{start:2,end:1,text:'倒序'}],[{start:0,end:48,text:'超出長度'}],[{start:0,end:3,text:'一'},{start:2,end:4,text:'二'}]])assert.throws(()=>validateVideo({...video,cues}),/cue/);
});
test('same subtitle source produces WebVTT and accessible HTML transcript',()=>{
 const vtt=renderVTT(video),html=renderTranscript(video);
 assert.match(vtt,/^WEBVTT\n/);assert.match(html,/原始發布日期：未確認/);
 for(const cue of video.cues){assert.ok(vtt.includes(cue.text));assert.ok(html.includes(cue.text));}
 assert.match(html,/尚待完整音訊人工複核/);
});
