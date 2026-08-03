.PHONY: run, mp3, help, sample16k, zh, zh2

run:
	./bin/crispasr -m ./model/chatterbox-turbo-t3-q8_0.gguf \
                --backend chatterbox-turbo \
                --codec-model ./model/chatterbox-turbo-s3gen-q8_0.gguf \
                --voice ./input/johnlee_24k.wav \
                --i-have-rights \
	              --no-prints \
                --temperature 0.8 \
		            --no-spoken-disclaimer \
		            --no-watermark \
                --no-c2pa \
                --accept-marking-responsibility \
                --tts "$$(cat ./scripts/emotion.txt)" \
                --tts-output ./output/chatterbox.wav


zh:
	./bin/crispasr -m ./model/qwen3-tts-12hz-1.7b-base-q8_0.gguf \
                --backend qwen3-tts-1.7b-base \
                --voice ./input/johnlee_24k.wav \
                --i-have-rights \
		            --ref-text "Captain figured, the sailor agreed, following Bartharus down and dogging the hatch behind him. You never know when the barbarians are going to go nuts. I don't know how you fellas can take it, he assured, shaking his head. They aren't so bad once you get to know them, Bartharus suggested. And the food is good, if spicy. But it was time for us to go, for now. Where is the captain?" \
	              --no-prints \
		            --no-spoken-disclaimer \
		            --no-watermark \
                --no-c2pa \
                --accept-marking-responsibility \
                --tts "$$(cat ./scripts/mix.txt)" \
                --tts-output ./output/mixqwen.wav

zh2:
	./bin/crispasr -m ./model/darwin-tts-1.7b-cross-q4_k.gguf \
                --backend qwen3-tts \
                --voice ./input/johnlee_24k.wav \
                --i-have-rights \
		            --ref-text "Captain figured, the sailor agreed, following Bartharus down and dogging the hatch behind him. You never know when the barbarians are going to go nuts. I don't know how you fellas can take it, he assured, shaking his head. They aren't so bad once you get to know them, Bartharus suggested. And the food is good, if spicy. But it was time for us to go, for now. Where is the captain?" \
	              --no-prints \
		            --no-spoken-disclaimer \
		            --no-watermark \
                --no-c2pa \
                --accept-marking-responsibility \
                --tts "$$(cat ./scripts/mix.txt)" \
                --tts-output ./output/mixdarwin.wav

s2:
	./bin/s2 \
		-m ./model/s2-pro-q4_k_m.gguf \
		-t ./model/tokenizer.json \
		-pa ./input/johnlee_24k.wav \
		-pt "Transcript of the reference audio." \
		-text "$$(cat ./scripts/mix.txt)" \
		--metal \
		-o ./output/mix.wav


help:
	./bin/crispasr --help

sample16k:
	ffmpeg -i ./input/input.mp4 -ar 16000 -ac 1 -c:a pcm_s16le ./input/johnlee.wav

sample24k:
	ffmpeg -i ./input/johnlee.wav -ar 24000 -ac 1 ./input/johnlee_24k.wav

mp3:
	ffmpeg \
    -i ./output/caravan.wav \
    -i ./output/caravan.jpg \
    -map 0:a \
    -map 1:v \
    -codec:a libmp3lame \
    -q:a 2 \
    -c:v mjpeg \
    -id3v2_version 3 \
    -metadata title="Caravan" \
    -metadata artist="James A. Michener" \
    -metadata:s:v title="Caravan" \
    output.mp3


# Captain figured, the sailor agreed, following Bartharus down and dogging the hatch behind him. You never know when the barbarians are going to go nuts. I don't know how you fellas can take it, he assured, shaking his head. They aren't so bad once you get to know them, Bartharus suggested. And the food is good, if spicy. But it was time for us to go, for now. Where is the captain?
