.PHONY: run

run:
	./bin/crispasr -m ./model/chatterbox-turbo-t3-q8_0.gguf \
                --backend chatterbox-turbo \
                --codec-model ./model/chatterbox-turbo-s3gen-q8_0.gguf \
                --voice ./input/johnlee_24k.wav \
                --i-have-rights \
		            --no-spoken-disclaimer --no-watermark --no-c2pa --accept-marking-responsibility \
                --tts "$$(cat ./scripts/caravan.txt)" \
                --tts-output ./output/caravan.wav


help:
	./bin/crispasr --help

sample16k:
	ffmpeg -i ./input/input.mp4 -ar 16000 -ac 1 -c:a pcm_s16le ./input/johnlee.wav

sample24k:
	ffmpeg -i ./input/johnlee.wav -ar 24000 -ac 1 ./input/johnlee_24k.wav
