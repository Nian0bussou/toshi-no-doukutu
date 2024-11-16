package gtime

import (
	"fmt"
	"time"
)

// returns a string in this format: [h::m::s]
func GetTime() string {
	h, m, s := gtime()
	return fmt.Sprintf("[%d::%d::%d]", h, m, s)
}

func gtime() (int, int, int) {
	return time.Now().Clock()
}
