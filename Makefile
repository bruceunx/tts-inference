.PHONY: run

run:
	./bin/crispasr -m ./model/chatterbox-turbo \
                --backend chatterbox-turbo \
                --voice ./input/johnlee_24k.wav \
                --i-have-rights \
		            --no-spoken-disclaimer --no-watermark --no-c2pa --accept-marking-responsibility \
                --tts "The sailor agreed, following Bathardish down and dogging the hatch behind him. You never know when the barbarians are going to go nuts." \
                --tts-output ./output/out.wav


help:
	./bin/crispasr --help

sample16k:
	ffmpeg -i ./input/input.mp4 -ar 16000 -ac 1 -c:a pcm_s16le ./input/johnlee.wav

sample24k:
	ffmpeg -i ./input/johnlee.wav -ar 24000 -ac 1 ./input/johnlee_24k.wav
