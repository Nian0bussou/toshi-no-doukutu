package ip

import (
	"fmt"
	"net"
	"net/http"
	"os"
	"strings"

	"wcmd/assert"
	"wcmd/gtime"
)

func GetIP(r *http.Request) {
	ips := getIP(r)
	ip_str := gtime.GetTime() + "|" + ips
	fmt.Printf("IP : {%s}\n", ip_str)
	noteIp("./ips.txt", ip_str)

	assert.Assert(ips == "::1" || ips == "127.0.0.1",
		"Some other parties tried to connect to the server (try looking into your firewall...)",
		ips)
}

func getIP(r *http.Request) string {
	// Check for IP in X-Forwarded-For header (comma-separated list of IPs)
	ip := r.Header.Get("X-Forwarded-For")
	if ip != "" {
		// Take the first IP in the list, which is the client’s real IP
		ip = strings.Split(ip, ",")[0]
		ip = strings.TrimSpace(ip) // Trim spaces, if any
		return ip
	}

	// Check for IP in X-Real-IP header (another common header for proxies)
	ip = r.Header.Get("X-Real-IP")
	if ip != "" {
		return ip
	}

	// Fallback to RemoteAddr if neither header is present
	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		// In case of an error, fallback to RemoteAddr as-is
		return r.RemoteAddr
	}

	return ip
}

func noteIp(filename string, text string) {
	file, err := os.OpenFile(filename, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)

	assert.NoError(err, "cant open file")
	defer file.Close()

	// Write the text to the file
	_, err = file.WriteString(text + "\n")
	assert.NoError(err, "cant write to file")
}
